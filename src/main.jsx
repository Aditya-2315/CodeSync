import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider,Router,createBrowserRouter,createRoutesFromElements, Route, BrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import LogHistory from './pages/LogHistory.jsx'
import Setting from './pages/Setting.jsx'
import Stats from './pages/Stats.jsx'
import NotFound from './pages/NotFound.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import SignUp from './pages/SignUp.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index element={<Landing/>}/>
      <Route path='dashboard' element={
        <PrivateRoute>
        <Dashboard/>
        </PrivateRoute>
        }/>
      <Route path='log-history'
      element={
        <PrivateRoute>
        <LogHistory/>
        </PrivateRoute>
        }
      />
      <Route path='setting' 
      element={
        <PrivateRoute>
        <Setting/>
        </PrivateRoute>
        }
      />
      <Route path='stats'
      element={
        <PrivateRoute>
        <Stats/>
        </PrivateRoute>
        }
      />
      <Route path='signup' element={<SignUp/>}/>
      <Route path='*' 
      element={
        <NotFound/>
        }
      />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>

    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
