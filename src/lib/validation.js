import toast from 'react-hot-toast';

export const handleFormInvalid = (e) => {
    e.preventDefault(); // previene el popup de validacion de html5
    const input = e.target;
    let fieldName = input.getAttribute('name') || input.id || input.type;

    if (input.validity.tooShort) {
        toast.error(`El campo de ${fieldName === 'password' ? 'contraseña' : fieldName} debe tener al menos ${input.minLength} caracteres.`, { id: 'form-invalid' });
        return;
    }

    if (input.type === 'email' && input.value) {
        toast.error('Por favor, ingresa un correo electrónico válido.', { id: 'form-invalid' });
        return;
    }

    if (fieldName) {
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');
        toast.error(`Por favor, verifique el campo: ${fieldName}`, { id: 'form-invalid' });
    } else {
        toast.error('Por favor, complete todos los campos requeridos correctamente.', { id: 'form-invalid' });
    }
};
