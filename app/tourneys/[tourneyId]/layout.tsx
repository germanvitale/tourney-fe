// app/tourneys/[tourneyId]/layout.js
import { TourneyProvider } from '../../context/TourneyContext'; // Ajusta la ruta si es necesario
import TournamentMenu from '../../components/TournamentMenu';

export default function TournamentLayout({ children, params }) {
    const { tourneyId } = params;

    return (
        <TourneyProvider tourneyId={tourneyId}>
            <div className="container">
                {/* Menú del Torneo */}
                <TournamentMenu tourneyId={tourneyId} />
                {/* Contenido específico de la página */}
                {children}
            </div>
        </TourneyProvider>
    );
}
