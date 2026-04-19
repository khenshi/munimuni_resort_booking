import { Outlet } from 'react-router-dom'
import LoginPageHeader from './LoginPageHeader'

export default function CustomerLayout() {
  return (
    <>
      <LoginPageHeader />
      <Outlet />
    </>
  )
}