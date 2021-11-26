import {
  AppBar,
  Drawer,
  List,
  Toolbar,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { grey } from "@mui/material/colors";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import logo from "../sns-logo.png";
import { Avatar } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    background: grey[100],
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const menuItems = [
    {
      text: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      text: "Boarding Houses",
      path: "/admin/boarding-house",
      icon: <OtherHousesIcon />,
    },
    {
      text: "Export",
      path: "/admin/export",
      icon: <ImportExportIcon />,
    },
    {
      text: "Profile",
      path: "/admin/profile",
      icon: <ManageAccountsIcon />,
    },
  ];
  return (
    <Drawer
      anchor="left"
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      sx={
        location.pathname === "/login"
          ? { display: "none" }
          : { display: "flex" }
      }
    >
      <AppBar position="static" elevation={1} color="default">
        <Toolbar sx={{ padding: "0 .7rem" }} disableGutters>
          <Avatar src={logo} style={{ height: "2rem", width: "2rem" }}></Avatar>
          <Typography
            variant="body1"
            component="h1"
            sx={{ fontFamily: "Quicksand" }}
          >
            SEARCH 'N STAY
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            divider
            disablePadding
            onClick={() => history.push(item.path)}
            sx={
              location.pathname === item.path
                ? {
                    background: grey[300],
                    color: grey[900],
                  }
                : { background: "transparent" }
            }
          >
            <ListItemButton>
              <ListItemIcon
                sx={
                  location.pathname === item.path
                    ? { color: grey[800] }
                    : { color: grey[500] }
                }
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
