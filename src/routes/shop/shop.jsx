// React Router
import { Outlet } from 'react-router-dom';

// Components
import Search from '../../components/search/search';

function Shop() {
  return (
    <div>
      <Search />
      <Outlet />
    </div>
  );
}

export default Shop;
