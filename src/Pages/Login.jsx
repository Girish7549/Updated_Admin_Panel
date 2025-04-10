import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { login } from '../Api/api';
import { useQuery } from '@tanstack/react-query';
import { axiosClients } from '../Apis/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.authenticated);

  // Use useQuery with object-based arguments
  const { data: loginResponse, error: loginError, isLoading: isLoadingLogin, refetch } = useQuery({
    queryKey: ['loginRequest'],
    queryFn: () => login(email, password),
    enabled: false, // Disable automatic execution
    retry: false,   // Do not retry on failure
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.warning("Please fill in all fields!", { position: "top-right" });
      return;
    }

    try {
      // setLoading(true);
      const data = {
        email: email,
        password: password,
      };

      const response = await axiosClients.post("/admin-user/login", data);
      console.log('RESPONSE :', response)
      localStorage.setItem('user', JSON.stringify(response.data));

      if (response.status === 201 || response.status === 200) {
        toast.success("Login successfully!", { position: "top-right" });
        setPassword("");
        setEmail("");
        navigate('/');
      } else {
        toast.error("Submission failed. Try again!", { position: "top-right" });
      }

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, []);
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center" style={{
      backgroundImage: 'url("https://img.freepik.com/premium-photo/directly-shot-office-supplies-table_1048944-27114195.jpg?w=996")',
      backgroundSize: 'cover',
      // backgroundPosition: 'center',
      // backgroundRepeat: 'no-repeat'
    }} >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type='email'
                        placeholder="Username"
                        autoComplete="username"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          color="primary"
                          className="px-4"
                          disabled={loading} // Use 'loading' here
                        >
                          {loading ? "Loading..." : "Login"}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
