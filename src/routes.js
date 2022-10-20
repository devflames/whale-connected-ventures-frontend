import Dashboard from "views/pages/Dashboard.js";
import User from "views/pages/User.js";
import Games from "views/pages/Games.js";
import Tournaments from "views/pages/Tournaments.js";
import Factions from "views/pages/Factions.js";
import Governance from "views/pages/Governance.js";
import Marketplace from "views/pages/Marketplace";
import Guilds from "views/pages/Guilds";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/user"
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "tim-icons icon-single-02",
    component: User,
    layout: "/user"
  },
  {
    path: "/guilds",
    name: "Guilds",
    icon: "tim-icons icon-bank",
    component: Guilds,
    layout: "/user"
  },
  {
    path: "/games",
    name: "Games",
    icon: "tim-icons icon-controller",
    component: Games,
    layout: "/user"
  },
  {
    path: "/tournaments",
    name: "Tournaments",
    icon: "tim-icons icon-trophy",
    component: Tournaments,
    layout: "/user"
  },
  {
    path: "/governance",
    name: "Governance",
    icon: "tim-icons icon-support-17",
    component: Governance,
    layout: "/user"
  }, 
  {
    path: "/marketplace",
    name: "Marketplace",
    icon: "tim-icons icon-coins",
    component: Marketplace,
    layout: "/user"
  }
];


export default routes;
