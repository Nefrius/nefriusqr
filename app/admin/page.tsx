'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { FaCoins, FaUser, FaClock, FaEdit } from 'react-icons/fa'
import Toast from '../components/Toast'

interface UserData {
  id: string
  name: string
  email: string
  coins: number
  isAdmin: boolean
  createdAt: string
}

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [newCoins, setNewCoins] = useState<number>(0)
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showToast = useCallback((message: string, type: 'info' | 'error' | 'success') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 3000)
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const userData: UserData[] = []
      querySnapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() } as UserData)
      })
      setUsers(userData)
    } catch (error) {
      console.error('Kullanıcıları getirme hatası:', error)
      showToast('Kullanıcıları getirirken bir hata oluştu', 'error')
    }
  }, [showToast])

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [loading, user, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin, fetchUsers])

  const updateUserCoins = async (userId: string, coins: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        coins: coins
      })
      showToast('Coin miktarı başarıyla güncellendi', 'success')
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Coin güncelleme hatası:', error)
      showToast('Coin güncellenirken bir hata oluştu', 'error')
    }
  }

  if (loading || !isAdmin) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Paneli</h1>
            <div className="text-gray-400">
              <span>Toplam Kullanıcı: {users.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {users.map((userData) => (
              <motion.div
                key={userData.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-gray-700/50 p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-600/50 p-3 rounded-lg">
                    <FaUser className="text-xl text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{userData.name}</h3>
                    <p className="text-sm text-gray-400">{userData.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-yellow-400">
                        <FaCoins className="mr-1" />
                        <span>{userData.coins}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <FaClock className="mr-1" />
                        <span>{new Date(userData.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {editingUser === userData.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newCoins}
                        onChange={(e) => setNewCoins(Number(e.target.value))}
                        className="bg-gray-800 text-white px-3 py-1 rounded-lg w-24"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateUserCoins(userData.id, newCoins)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg"
                      >
                        Kaydet
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingUser(null)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      >
                        İptal
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingUser(userData.id)
                        setNewCoins(userData.coins)
                      }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <FaEdit className="text-xl" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </main>
  )
} 