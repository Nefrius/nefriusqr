'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { auth, googleProvider, db } from '../firebase'
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  coins: number
  loading: boolean
  error: string | null
  isAdmin: boolean
  nextCoinRefresh: Date | null
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateCoins: (newAmount: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface UserData {
  nextCoinRefresh?: string | null;
  coins?: number;
  isAdmin?: boolean;
  stats?: {
    totalGenerated: number;
    totalSpent: number;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [coins, setCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [nextCoinRefresh, setNextCoinRefresh] = useState<Date | null>(null)

  const checkAndAddDailyCoins = useCallback(async (userData: UserData) => {
    if (!user) return;
    
    const now = new Date()
    const nextRefresh = userData.nextCoinRefresh ? new Date(userData.nextCoinRefresh) : null

    if (!nextRefresh || now >= nextRefresh) {
      const newNextRefresh = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      try {
        await setDoc(doc(db, 'users', user.uid), {
          coins: (userData.coins || 0) + 100,
          nextCoinRefresh: newNextRefresh.toISOString(),
          email: user!.email,
          name: user!.displayName,
          isAdmin: userData.isAdmin || false,
          stats: userData.stats || { totalGenerated: 0, totalSpent: 0 }
        }, { merge: true })
        
        setCoins((userData.coins || 0) + 100)
        setNextCoinRefresh(newNextRefresh)
      } catch (error) {
        console.error('Günlük coin ekleme hatası:', error)
      }
    } else {
      setNextCoinRefresh(nextRefresh)
    }
  }, [user, setCoins, setNextCoinRefresh])

  const fetchUserData = useCallback(async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        setCoins(userData.coins || 0)
        setIsAdmin(userData.isAdmin || false)
        await checkAndAddDailyCoins(userData)
      } else {
        const now = new Date()
        const newNextRefresh = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        
        await setDoc(doc(db, 'users', user.uid), {
          coins: 100,
          nextCoinRefresh: newNextRefresh.toISOString(),
          email: user.email,
          name: user.displayName,
          isAdmin: false,
          createdAt: now.toISOString(),
          stats: {
            totalGenerated: 0,
            totalSpent: 0
          }
        })
        setCoins(100)
        setIsAdmin(false)
        setNextCoinRefresh(newNextRefresh)
      }
      setError(null)
    } catch (err) {
      console.error('Veri çekme hatası:', err)
      setError('Kullanıcı verilerini çekerken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.')
    }
  }, [checkAndAddDailyCoins])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await fetchUserData(user)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [fetchUserData])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      await fetchUserData(result.user)
    } catch (error) {
      console.error('Giriş hatası:', error)
      setError('Google ile giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
      setCoins(0)
    } catch (error) {
      console.error('Çıkış hatası:', error)
      setError('Çıkış yaparken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const updateCoins = async (newAmount: number) => {
    if (!user) return

    try {
      setError(null)
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.data()
      
      await setDoc(doc(db, 'users', user.uid), {
        coins: newAmount,
        email: user.email,
        name: user.displayName,
        stats: {
          ...userData?.stats,
          totalSpent: (userData?.stats?.totalSpent || 0) + (coins - newAmount)
        }
      }, { merge: true })
      
      setCoins(newAmount)
    } catch (error) {
      console.error('Coin güncelleme hatası:', error)
      setError('Coin güncellenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      coins, 
      loading, 
      error, 
      isAdmin, 
      nextCoinRefresh,
      signInWithGoogle, 
      logout, 
      updateCoins 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 