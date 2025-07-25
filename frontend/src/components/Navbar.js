
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Navbar = (props) => {
  let location = useLocation();
  // useEffect(() => {
  //   console.log(location.pathname)
  // }, [location]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ❌ Clear token
    props.shoAlert("Logged out Successfully", "success");
    navigate('/login');               // ⛳ Redirect to login page
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">iNotebook</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
            </li>
          </ul>
        </div>
        <form className="d-flex" role="search">
          {!localStorage.getItem('token') ? (
            <>
              <Link className="btn btn-primary mx-1" to="/login">Login</Link>
              <Link className="btn btn-secondary mx-1" to="/signup">Sign Up</Link>
            </>
          ) : (
            <button className="btn btn-danger mx-1" onClick={handleLogout}>Logout</button>
          )}




        </form>

      </div>
    </nav>
  )
}

export default Navbar;
