import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import './Profile.css'

export default function Profile() {
  const { logout, user } = useAuth()
  const [toastMsg, setToastMsg] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(null)

  /* -------------------- TOAST -------------------- */
  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  /* -------------------- LOAD PROFILE -------------------- */
  useEffect(() => {
    if (!user) return

    const loadProfile = async () => {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        setProfile(snap.data().profile)
        setFormData(snap.data().profile)
      } else {
        // first time user
        const initialProfile = {
          name: user.email.split('@')[0],
          email: user.email,
          phone: '',
          avatar: null,
          createdAt: serverTimestamp()
        }

        await setDoc(ref, { profile: initialProfile })
        setProfile(initialProfile)
        setFormData(initialProfile)
      }
    }

    loadProfile()
  }, [user])

  /* -------------------- HANDLERS -------------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    await updateDoc(doc(db, 'users', user.uid), {
      profile: formData
    })

    setProfile(formData)
    setIsEditing(false)
    showToast('Profile updated successfully')
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const updated = { ...formData, avatar: reader.result }
      setFormData(updated)
      setProfile(updated)

      await updateDoc(doc(db, 'users', user.uid), {
        profile: updated
      })
    }
    reader.readAsDataURL(file)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    showToast('Logged out successfully')
    setTimeout(async () => {
      await logout()
    }, 800)
  }

  if (!profile) return null

  /* -------------------- UI -------------------- */

  return (
    <div className="page profile-page">
      <Header title="Profile" subtitle="Your personal information" />

      {toastMsg && <Toast message={toastMsg} />}

      <div className="profile-container">
        <div className="profile-main">
          <div className={`profile-card ${isEditing ? 'editing' : ''}`}>

            {!isEditing ? (
              <>
                {/* Avatar */}
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" />
                    ) : (
                      <span className="avatar-placeholder">👤</span>
                    )}
                  </div>

                  <label className="btn-upload-avatar">
                    Change Logo
                    <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                  </label>

                  <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                    <Edit2 size={18} /> Edit Profile
                  </button>
                </div>

                {/* Details */}
                <div className="profile-details">
                  <div className="detail-item">
                    <div className="detail-icon"><User size={20} /></div>
                    <div className="detail-content">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{profile.name}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon"><Mail size={20} /></div>
                    <div className="detail-content">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{profile.email}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon"><Phone size={20} /></div>
                    <div className="detail-content">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{profile.phone || '—'}</span>
                    </div>
                  </div>

                  <div className="profile-logout">
                    <button className="btn btn-logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Edit Form */
              <div className="edit-form">
                <h3>Edit Your Profile</h3>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button className="btn btn-save" onClick={handleSaveProfile}>
                    <Save size={18} /> Save
                  </button>
                  <button className="btn btn-cancel" onClick={handleCancel}>
                    <X size={18} /> Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
