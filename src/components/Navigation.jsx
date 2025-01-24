import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';
import axios from "axios";

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken !== null) {
      setIsAuth(true);
      // Fetch user profile to get the role
      (async () => {
        try {
          const { data } = await axios.get('http://localhost:8000/user-profile/', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          setRole(data.role); // Store the role (admin or teacher)
          console.log(data.role)
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Redirect to login if there's an issue
        }
      })();
    }
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuth && (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                {role === 'admin' && (  // Render admin specific links
                  <>
                    <Nav.Link href="/manage-faculties">Manage Faculty</Nav.Link>
                    <Nav.Link href="/add-programme">Add Programme</Nav.Link>
                    <Nav.Link href="/add-course">Add Course</Nav.Link>
                    <Nav.Link href="/add-batch">Add Batch</Nav.Link>
                  </>
                )}
                {role === 'teacher' && (  // Render teacher specific links
                  <>
                    <Nav.Link href="/view-assignments">View Assignments</Nav.Link>
                    <Nav.Link href="/view-courses">View Courses</Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {isAuth ? (
              <Nav.Link href="/logout">Logout</Nav.Link>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
