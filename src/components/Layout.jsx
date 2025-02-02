import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  UsergroupAddOutlined,
  ClusterOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  FormOutlined,
} from "@ant-design/icons";

import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu as MuiMenu, MenuItem, ListItemIcon } from "@mui/material";
import { Space } from "antd/es";
import { Person, AccountCircle, ExitToApp } from "@mui/icons-material";
import "../index.css";

const { Header, Sider, Content, Footer } = Layout;

const ExactLayout = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // Store user role
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const storedFullName = localStorage.getItem("full_name");
    const storedRole = localStorage.getItem("role"); // Get role from localStorage

    if (storedFullName) setUserName(storedFullName);
    if (storedRole) setUserRole(storedRole); // Set role state
  }, []);

  const handleLogout = () => {
    navigate("/logout");
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        // breakpoint="md"  // Added responsive breakpoint
        // collapsedWidth="0"  // Set collapsed width to 0
        // onBreakpoint={(broken) => setCollapsed(broken)}  // Toggle collapse state based on screen width
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            height: "45px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: borderRadiusLG,
            margin: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            paddingLeft: collapsed ? "0px" : "10px",
          }}
        >
          <img
            src="./nascshort.png"
            style={{ height: "30px", marginLeft: "5%" }}
            alt="Logo"
          />
          {!collapsed && (
            <span
              style={{
                marginLeft: "10px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              NASC
            </span>
          )}
        </div>

        {/* Sidebar Menu */}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item
            key="1"
            icon={<HomeOutlined style={{ fontSize: "20px" }} />}
          >
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="sub1"
            icon={<AppstoreAddOutlined style={{ fontSize: "20px" }} />}
            title="Manage"
          >
            {/* This menu is only visible if the role is 'admin' */}
            {userRole === "admin" && (
              <Menu.Item
                key="2"
                icon={<UsergroupAddOutlined style={{ fontSize: "20px" }} />}
              >
                <Link to="/manage-faculties">Faculties</Link>
              </Menu.Item>
            )}
            <Menu.Item
              key="3"
              icon={<ClusterOutlined style={{ fontSize: "20px" }} />}
            >
              <Link to="/manage-batches">Batch</Link>
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<UnorderedListOutlined style={{ fontSize: "20px" }} />}
            >
              <Link to="/manage-courses">Courses</Link>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<AppstoreAddOutlined style={{ fontSize: "20px" }} />}
            >
              <Link to="/manage-programmes">Programmes</Link>
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={<TeamOutlined style={{ fontSize: "20px" }} />}
            >
              <Link to="/manage-students">Students</Link>
            </Menu.Item>
            <Menu.SubMenu
              key="sub2"
              icon={<FieldTimeOutlined style={{ fontSize: "20px" }} />}
              title="Attainment"
            >
              <Menu.Item
                key="7"
                icon={<ProjectOutlined style={{ fontSize: "20px" }} />}
              >
                <Link to="/manage-co">CO's</Link>
              </Menu.Item>
              <Menu.Item
                key="8"
                icon={<ProjectOutlined style={{ fontSize: "20px" }} />}
              >
                <Link to="/manage-pos">PO's</Link>
              </Menu.Item>
              <Menu.Item
                key="9"
                icon={<ProjectOutlined style={{ fontSize: "20px" }} />}
              >
                <Link to="/manage-pso">PSO's</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
          {userRole === "teacher" && (
            <Menu.SubMenu
              key="sub3"
              icon={<FileTextOutlined style={{ fontSize: "20px" }} />}
              title="Assessment"
            >
              <Menu.Item
                key="10"
                icon={<FormOutlined style={{ fontSize: "20px" }} />}
              >
                <Link to="/manage-internal-exam">Internal Exams</Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
        </Menu>
      </Sider>

      <Layout>
        {/* Header Section */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: "0",
            zIndex: 1000, // Ensures it stays above other elements
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", height: "100%" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <p
              onClick={() => navigate("/")}
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              EXACT
            </p>
          </div>

          {/* User Dropdown Menu */}
          <Space>
            {userName && (
              <a
                onClick={handleMenuClick}
                style={{
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  marginRight: "20px",
                }}
              >
                {userName} <DownOutlined />
              </a>
            )}
          </Space>

          {/* MUI Dropdown Menu */}
          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Account
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </MuiMenu>
        </Header>

        {/* Main Content Section */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            maxHeight: "5px",
          }}
        >
          Copyright © {new Date().getFullYear()} Exact. All Rights Reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ExactLayout;
