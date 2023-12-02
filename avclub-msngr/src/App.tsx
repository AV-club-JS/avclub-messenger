import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom';
// routes
import { Wrapper } from './containers/Wrapper';
import { Home } from './containers/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './containers/Profile';
import { Chats } from './containers/Chats';

//Browser router
const appRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Wrapper />}>
      <Route index element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/chats' element={<Chats />}/>
    </Route>
  )
);

export const App = () => <RouterProvider router={appRoutes} />
