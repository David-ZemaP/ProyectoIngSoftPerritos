function buscar(name)
{
    const nombre = 'Max';
    if (name === nombre) {
        throw new Error('¡Mascota Encontrada!');
    }
    return '¡Mascota No Encontrada!';
}

export default buscar;