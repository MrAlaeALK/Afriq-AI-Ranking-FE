import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VisitorLayout = () => (
    <div className="font-sans">
        <Header />
        <Outlet />
        <Footer />
    </div>
)

export default VisitorLayout;