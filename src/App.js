import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Signuppage from "./screen/Signuppage";
import { useEffect, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";
import Infopage from "./screen/infopage";
import InfopageTwo from "./screen/infopage_two";
import Dashboard from "./screen/Dashboard";
import Authpage from "./screen/authpage";
import PrivateRoute from "./utilities/ProtectedRoute";
import SignIn from "./screen/SignIn";
import Task from "./screen/Task";
import TaskDetails from "./screen/task_details";
import Message from "./screen/message";
import MessageDetails from "./screen/message_details";
import ProtectedRoute from "./utilities/ProtectedRoute";
import { AuthProvider } from "./utilities/Auth";
import { requestNotificationPermission } from "./utilities/firebaseConfig";
import EditProfile from "./screen/edit_profile";
import RaiseDispute from "./screen/RaiseDispute";
import UploadProof from "./screen/Uploadproof";
import TaskHistory from "./screen/Taskhistory";
import Reviews from "./screen/reviews";
import Earnings from "./screen/Earnings";
import Availability from "./screen/Availability";
import Notifications from "./screen/notification";
import Settings from "./screen/settings";
import TrackLocation from "./screen/TrackLocation";
import ScheduledTasks from "./screen/Scheduledtasks";
import Analytics from "./screen/Analytics";
import MapView from "./screen/MapView";
import LiveLocation from "./screen/Livelocation";
import EarningsDashboard from "./screen/Earningsdashboard";
import ServicePricing from "./screen/Servicepricing";
import CallTechnician from "./screen/Calltechnician";
import Chat from "./screen/message_details";
import Profile from "./screen/Profile";

export const googleMapsApiKey = "AIzaSyCeirrtXS_SjOfBcSX_-uetXg0jtsawF-s";

function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<Signuppage />} />
        <Route path='/info_one' element={<Infopage />} />
        <Route path='/info_two' element={<InfopageTwo />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/task' element={<Task />} />
        <Route path='/task_details/:taskId' element={<TaskDetails />} />
        {/* <Route path='/message' element={<Message />} />*/}
        <Route path='/chat/:jobId' element={<Chat />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/raise-dispute/:taskId' element={<RaiseDispute />} />
        <Route path='/task-history' element={<TaskHistory />} />
        <Route path='/upload-proof/:taskId' element={<UploadProof />} />
        <Route path='/reviews' element={<Reviews />} />
        <Route path='/earnings' element={<Earnings />} />
        <Route path='/availability' element={<Availability />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/track-location' element={<TrackLocation />} />
        <Route path='/scheduled-tasks' element={<ScheduledTasks />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/map-view' element={<MapView />} />
        <Route path='/live-location' element={<LiveLocation />} />
        <Route path='/earnings-dashboard' element={<EarningsDashboard />} />
        <Route path='/service-pricing' element={<ServicePricing />} />
        <Route path='/call-technician' element={<CallTechnician />} />
      </Routes>
    </Router>
  );
}

export default App;
