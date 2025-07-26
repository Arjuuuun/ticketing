import Link from 'next/link';

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: "Sign Up", href: "/auth/signup" },
        !currentUser && { label: "Sign In", href: "/auth/signin" },
        currentUser && { label: "Sell Tickets", href: "/tickets/new" },
        currentUser && { label: "My Orders", href: "/orders" },
        currentUser && { label: "Sign Out", href: "/auth/signout" }
    ]
        .filter(Boolean) // same as linkConfig => linkConfig
        .map(({ label, href }) => (
            <li className="nav-item" key={href}>
                <Link href={href} className="nav-link">
                    {label}
                </Link>
            </li>
        ));

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3 shadow-sm">
            <Link href="/" className="navbar-brand fw-bold fs-4 text-primary">
                Ticketing
            </Link>

            <div className="ms-auto">
                <ul className="navbar-nav d-flex flex-row gap-3">
                    {links}
                </ul>
            </div>
        </nav>
    );
};

export default Header;
