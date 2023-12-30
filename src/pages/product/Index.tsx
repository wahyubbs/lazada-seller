import { Breadcrumbs, Container, Typography, Link } from "@mui/material";
import {
  LinkProps,
  Outlet,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={RouterLink as any} />;
}

const breadcrumbNameMap: { [key: string]: string } = {
  "/product": "Product",
  "/product/create": "Create",
};

function Product() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    // console.log(event.target.href);
  }
  return (
    <Container fixed maxWidth={false} sx={{ padding: 3 }}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <LinkRouter underline="hover" color="inherit" to="/">
            Beranda
          </LinkRouter>
          {pathnames.map((item, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            return last ? (
              <Typography color="text.primary" key={to}>
                {breadcrumbNameMap[to]}
              </Typography>
            ) : (
              <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                {breadcrumbNameMap[to]}
              </LinkRouter>
            );
          })}
        </Breadcrumbs>
      </div>
      <Outlet />
    </Container>
  );
}

export default Product;
