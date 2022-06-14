import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';


const PageTemplate = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default PageTemplate;