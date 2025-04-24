
export interface Regla {
    formacionFija: boolean; // Si es true, se usará la formación definida en "formacionDefinida"
    formacionDefinida: '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2' | '4-2-3-1' | null; // Formaciones permitidas
    permitirJugadoresRepetidos: boolean; // Permitir jugadores repetidos en los equipos
    ligasPermitidas: string[]; // Lista de ligas permitidas (vacío significa todas las ligas)
    presupuesto: number | null; // Presupuesto permitido
}

export interface Sala {
    codigo: string;
    reglas : Regla[];
    jugadores: Jugador[];
    turnoActual: number;
    estado: string;
    creada: Date;
    
}

export interface Jugador{
    nick: string;
    avatar: string;

}

export interface Futbolista {
    nombre: string; 
    posicion: string;
    valor: number; 
}

export interface Equipo {
    nombre: string; // Nombre del equipo
    futbolistas: Futbolista[]; // Array de futbolistas (máximo 11)
    presupuestoRestante: number | null; // Presupuesto restante del equipo
}