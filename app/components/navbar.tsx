"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const currentPath = usePathname();
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link href={`/tourneys`}
                              className={`${currentPath === "/tourneys" ? "font-semibold" : "text-slate-600"} me-3`}>
                            <div>Tournaments</div>
                        </Link>
                        <Link href={`/teams`}
                              className={`${currentPath === "/teams" ? "font-semibold" : "text-slate-600"} me-3`}>
                            <div>Teams</div>
                        </Link>
                        <Link href={`/players`}
                              className={`${currentPath === "/players" ? "font-semibold" : "text-slate-600"} me-3`}>
                            <div>Players</div>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>

    );
}
