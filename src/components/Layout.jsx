import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Use Outlet to render nested routes
import {
  Menu as MuiMenu, //Matte sidebar import aakyel Menu parnjittoru sanundayni appo mui menu import akan aavnindayta athond import menu as muiMenu aaki
  MenuItem,
  ListItemIcon,
} from "@mui/material"; // MUI Menu and MenuItem
import { Space } from "antd/es";
import {
  Home,
  People,
  Group,
  MenuBook,
  School,
  PersonAdd,
  Person,
  AccountCircle,
  ExitToApp,
  ManageAccounts,
  GroupWork,
} from "@mui/icons-material"; // Import MUI icons
import '../index.css'

const { Header, Sider, Content } = Layout;

const ExactLayout = () => {
  const [userName, setUserName] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For MUI menu
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const storedFullName = localStorage.getItem("full_name");
    if (storedFullName) {
      setUserName(storedFullName);
    }
  }, []);

  // Handle logout logic
  const handleLogout = () => {
    navigate("/logout"); // Redirect to login page
    setAnchorEl(null); // Close the menu after logout
  };

  // Open the MUI menu on click
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the MUI menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: "45px", // Matches the height of the header
            backgroundColor: "rgba(255, 255, 255, 0.2)", // Subtle background color
            borderRadius: borderRadiusLG,
            margin: "10px",
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
        >
          <Menu.Item key="1" icon={<Home style={{ fontSize: "20px" }} />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="sub1"
            icon={<ManageAccounts style={{ fontSize: "20px" }} />}
            title="Manage"
          >
            <Menu.Item key="2" icon={<Person style={{ fontSize: "20px" }} />}>
              <Link to="/manage-faculties">Faculties</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<GroupWork style={{ fontSize: "20px" }} />}>
              <Link to="/manage-batches">Batch</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<MenuBook style={{ fontSize: "20px" }} />}>
              <Link to="/manage-courses">Courses</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<School style={{ fontSize: "20px" }} />}>
              <Link to="/manage-programmes">Programmes</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<People style={{ fontSize: "20px" }} />}>
              <Link to="/manage-students">Students</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* App Name on the left */}
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
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>EXACT</p>
          </div>

          {/* User Name and Dropdown on the right */}
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

          {/* MUI Menu for the dropdown */}
          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            defaultSelectedKeys={["1"]}
          >
            <MenuItem onClick={handleCloseMenu} key="1">
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
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* This will render the nested routes here */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ExactLayout;
