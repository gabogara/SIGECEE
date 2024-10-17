import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AccountProfileDetails from './account/ProfileDetails'
import EditProfileModal from './modals/EditProfile'
import ChangePasswordModal from './modals/ChangePassword'
import CustomizedSnackbars from '../mui/SnackbarMUI'
import Api from '../../services/Api'

const Profile = () => {
  const todos = useSelector((state) => state.todos)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visiblePass, setVisiblePass] = useState(false)
  const [roles, setRoles] = useState([])
  const [schools, setSchools] = useState([])
  const [user, setUser] = useState({})
  const [openSnack, setOpenSnack] = useState(false)
  const [snackMessage, setSnackMessage] = useState({
    color: '',
    message: '',
  })

  useEffect(() => {
    ; (async () => {
      await Api.get('/user/get?_id=' + todos.userInfo._id)
        .then((res) => {
          setUser(res.data.users)
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
    })()
      ; (async () => {
        await Api.get('/role/all')
          .then((res) => {
            setRoles(res.data.roles)
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
      })()
      ; (async () => {
        await Api.get('/school/all')
          .then((res) => {
            setSchools(res.data.schools)
          })
          .catch((error) => {
            console.error('Error:', error.message)
          })
      })()
  }, [todos.userInfo._id])

  return (
    <>
      <CustomizedSnackbars
        open={openSnack}
        setOpenSnack={setOpenSnack}
        message={snackMessage.message}
        color={snackMessage.color}
      />
      <EditProfileModal
        user={user}
        setUser={setUser}
        schools={schools}
        setVisible={setVisibleEdit}
        visible={visibleEdit}
        setOpenSnack={setOpenSnack}
        setSnackMessage={setSnackMessage}
      />
      <ChangePasswordModal
        user={user}
        setVisible={setVisiblePass}
        visible={visiblePass}
        setOpenSnack={setOpenSnack}
        setSnackMessage={setSnackMessage}
      />
      <AccountProfileDetails
        user={user}
        roles={roles}
        schools={schools}
        setVisibleEdit={setVisibleEdit}
        setVisiblePass={setVisiblePass}
      />
    </>
  )
}

export default Profile
