
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

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
                <Nav.Link href="/manage-faculties">Manage Faculty</Nav.Link>
                <Nav.Link href="/add-programme">Add Programme</Nav.Link>
                <Nav.Link href="/add-course">Add Course</Nav.Link>
                <Nav.Link href="/add-batch">Add Batch</Nav.Link>
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
