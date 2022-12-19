import React from "react";
import {Link , useNavigate} from "react-router-dom";
const Nav=()=>{
    const auth= localStorage.getItem('user');
    
    const navigate= useNavigate();
    const logout=()=>{
        localStorage.clear();
        navigate('/signup')
    }
    return(
        <div>
            <img
             src="./logo/logo.jpg"
            alt="logo"
            className="logo" 
           />
          {
          auth ?  <ul className="nav-ul">
                <li><Link to="/"><h3>Products</h3></Link></li>
                <li><Link to="/add"><h3>Add Product</h3></Link></li>
                <li><Link to="/update"><h3>Update Product</h3></Link></li>
                <li><Link to="/profile"><h3>Profile</h3></Link></li>
                <li><Link onClick={logout} to="/signup"><h3>Logout ({JSON.parse(auth).name})</h3></Link></li>
               </ul>
                :
                <ul  className="nav-ul nav-right">
                <li> <Link to="/signup"><h3>Signup</h3></Link></li>
                <li><Link to="/login"><h3>Login</h3></Link></li>
            </ul>
          }
        </div>
    )
}
export default Nav;