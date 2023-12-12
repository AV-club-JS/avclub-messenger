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
import { Chats } from './containers/Chats';
import { NotFound } from './containers/NotFound';
import { Teams } from './containers/Teams';
import { TeamView } from './components/TeamView';
import { TeamChannelWrapper } from './components/TeamChannelWrapper';
import { MeetingWrapper } from './components/MeetingWrapper';
import { ProfileWrapper } from './containers/Profile';

//Browser router
const appRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Wrapper />}>
      <Route index element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path=':userId' element={<ProfileWrapper />} />
      <Route path='/teams' element={<Teams />}>
        <Route path='team/:teamId' element={<TeamView />} />
        <Route path='channel/:chatId' element={<TeamChannelWrapper />} />
      </Route>
      <Route path='/chats' element={<Chats />} />
      <Route path='/meeting/:roomId' element={<MeetingWrapper />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

export const App = () => <RouterProvider router={appRoutes} />
