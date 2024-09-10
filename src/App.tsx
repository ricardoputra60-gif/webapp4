import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';

import Transfer from './pages/Transfer/Transfer';
import Deposite from './pages/Deposite/Deposite';




function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();



  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  


  

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        index
        element={
          <DefaultLayout>
            <PageTitle title="RML Bank Fake" />
            <Dashboard />
          </DefaultLayout>
        }
      />
     
      {/* Tidak Di pake */}

      <Route
        path='/deposite/deposite'
        element={
          <DefaultLayout>
            <PageTitle title="Deposits | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
            <Deposite/>
          </DefaultLayout>
        }
      />

      <Route
        path='/transfer/transfer'
        element={
          <DefaultLayout>
            <PageTitle title="Transfer | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
            <Transfer/>
          </DefaultLayout>
        }
      />

      {/* Import AuthRoutes for authentication-related routes */}
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Internet Banking App" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignUp />
          </>
        }
      />
    </Routes>
  );
}

export default App;



