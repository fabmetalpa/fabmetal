import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import NiceSelect from "@ui/nice-select";
import NoticeCard from "@components/notice-card";
import { IDType, ImageType } from "@utils/types";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationArea = ({ data }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });
    
    const [serverState, setServerState] = useState({
        submitting: false,
        status: null,
    });

    const [current, setCurrent] = useState("newest");
    const [notifications, setNotifications] = useState([]);

    const changeHandler = (item) => {
        setCurrent(item.value);
    };

    const filterHandler = useCallback(() => {
        if (data?.notifications) {
            const allNotifications = data.notifications;
            const filterdSellers = allNotifications.filter(
                (noti) => noti.type === current
            );
            setNotifications(filterdSellers);
        }
    }, [current, data]);

    // Calcular total
    let total = 0;
    if (data?.productos) {
        for (let i = 0; i < data.productos.length; i++) {
            total += Number(data.productos[i].precioTotal || 0);
        }
    }

    useEffect(() => {
        filterHandler();
    }, [filterHandler]);

    // Función principal para enviar la cotización
    const onSubmit = async (formData) => {
        try {
            setServerState({ submitting: true, status: null });
            
            // Obtener productos del carrito
            const prodsCart = JSON.parse(localStorage.getItem("productosGlobal") || "[]");
            
            if (!prodsCart || prodsCart.length === 0) {
                toast.error("No hay productos en el carrito");
                setServerState({ submitting: false, status: null });
                return;
            }
            
            console.log("📋 Enviando cotización a Odoo...");
            console.log("📦 Productos en carrito:", prodsCart);
            
            // Enviar datos a nuestra API de Next.js
            const response = await fetch('/api/cotizacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    contacto: formData.contacto,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    direccion: formData.direccion,
                    mensaje: formData.mensaje,
                    productos: prodsCart.map(prod => ({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price || 0,
                        cantidad: prod.cantidad || 1
                    }))
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al crear cotización en Odoo');
            }
            
            // Mostrar éxito
            toast.success(`✅ Cotización #${result.orderNumber} creada exitosamente en Odoo!`);
            
            // Preparar mensaje para WhatsApp
            let mensajeWsp = `*Nueva Cotización Web - ${result.orderNumber}*%0A%0A`;
            mensajeWsp += `*Cliente:* ${formData.nombre}%0A`;
            mensajeWsp += `*Contacto:* ${formData.contacto || formData.nombre}%0A`;
            mensajeWsp += `*Teléfono:* ${formData.telefono}%0A`;
            mensajeWsp += `*Email:* ${formData.correo}%0A`;
            mensajeWsp += `*Dirección:* ${formData.direccion || 'No especificada'}%0A`;
            mensajeWsp += `*Mensaje:* ${formData.mensaje || 'Sin comentarios'}%0A%0A`;
            mensajeWsp += `*Productos solicitados:*%0A`;
            
            let totalCotizado = 0;
            prodsCart.forEach((prod, index) => {
                const subtotal = (prod.price || 0) * (prod.cantidad || 1);
                totalCotizado += subtotal;
                mensajeWsp += `${index + 1}. ${prod.name}%0A`;
                mensajeWsp += `   Cantidad: ${prod.cantidad || 1}%0A`;
                mensajeWsp += `   Precio unitario: $${prod.price || 0}%0A`;
                mensajeWsp += `   Subtotal: $${subtotal}%0A%0A`;
            });
            
            mensajeWsp += `*TOTAL COTIZADO:* $${totalCotizado}%0A%0A`;
            mensajeWsp += `*ID Cotización Odoo:* ${result.orderNumber}%0A`;
            mensajeWsp += `*Fecha:* ${new Date().toLocaleDateString()}%0A`;
            mensajeWsp += `_Cotización generada desde la web_`;
            
            // Limpiar carrito
            localStorage.removeItem("productosGlobal");
            if (data && data.vaciarCarrito) {
                data.vaciarCarrito([]);
            }
            
            // Opción para compartir por WhatsApp
            setTimeout(() => {
                const whatsappUrl = `https://wa.me/50768055616?text=${mensajeWsp}`;
                
                if (window.confirm('¿Desea compartir esta cotización por WhatsApp?')) {
                    window.open(whatsappUrl, '_blank');
                }
            }, 1500);
            
            setServerState({ 
                submitting: false, 
                status: { ok: true, msg: `Cotización #${result.orderNumber} creada exitosamente` } 
            });
            
        } catch (error) {
            console.error("❌ Error en cotización:", error);
            toast.error(`Error: ${error.message}`);
            setServerState({ 
                submitting: false, 
                status: { ok: false, msg: error.message } 
            });
        }
    };

    return (
        <>
            <br/><br/>
            <ToastContainer 
                position="top-right" 
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="rn-notification-area right-fix-notice ">
                <div className="h--100">
                    {/* Resumen del carrito */}
                    <div className="notice-heading">
                        <h4>Resumen del Carrito</h4>
                        {data?.productos?.map((prod, index) => (
                            <div key={index} style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>
                                <strong>{prod.name}</strong><br/>
                                Cantidad: {prod.cantidad || 1} | Precio: ${prod.price || 0}<br/>
                                Subtotal: ${prod.precioTotal || prod.price || 0}
                            </div>
                        ))}
                        {data?.productos?.length > 0 ? (
                            <h4>Total: ${total}</h4>
                        ) : (
                            <p>No hay productos en el carrito</p>
                        )}
                    </div>
                    
                    <div className="notice-heading mt-4">
                        <h4>Complete el formulario para generar su cotización en Odoo</h4>
                        <p>Una vez enviado, se creará automáticamente una cotización en nuestro sistema ERP.</p>
                    </div>
                </div>
            </div>

            <div className="form-wrapper-one registration-area mt--50">
                <h3 className="mb--30">Cotizar en Odoo</h3>
                <form
                    className="rwt-dynamic-form"
                    id="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-5">
                        <label htmlFor="nombre" className="form-label">
                            Razón Social *
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            {...register("nombre", {
                                required: "Nombre es requerido",
                            })}
                            disabled={serverState.submitting}
                            placeholder="Nombre de la empresa o persona"
                        />
                        {errors.nombre && (
                            <ErrorText>{errors.nombre?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="contacto" className="form-label">
                            Persona de Contacto
                        </label>
                        <input
                            id="contacto"
                            type="text"
                            {...register("contacto")}
                            disabled={serverState.submitting}
                            placeholder="Persona responsable de la cotización"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="correo" className="form-label">
                            Correo Electrónico *
                        </label>
                        <input
                            name="correo"
                            type="email"
                            {...register("correo", {
                                required: "Correo es requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "El correo es invalido",
                                },
                            })}
                            disabled={serverState.submitting}
                            placeholder="ejemplo@empresa.com"
                        />
                        {errors.correo && (
                            <ErrorText>{errors.correo?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="telefono" className="form-label">
                            Teléfono *
                        </label>
                        <input
                            name="telefono"
                            type="tel"
                            {...register("telefono", {
                                required: "Teléfono es requerido",
                            })}
                            disabled={serverState.submitting}
                            placeholder="+507 1234 5678"
                        />
                        {errors.telefono && (
                            <ErrorText>{errors.telefono?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="direccion" className="form-label">
                            Dirección (Opcional)
                        </label>
                        <input
                            id="direccion"
                            type="text"
                            {...register("direccion")}
                            disabled={serverState.submitting}
                            placeholder="Dirección para entrega"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="mensaje" className="form-label">
                            Mensaje o Comentarios *
                        </label>
                        <textarea
                            id="mensaje"
                            rows="4"
                            {...register("mensaje", {
                                required: "Mensaje es requerido",
                            })}
                            disabled={serverState.submitting}
                            placeholder="Especificaciones técnicas, condiciones especiales, requerimientos adicionales..."
                        />
                        {errors.mensaje && (
                            <ErrorText>{errors.mensaje?.message}</ErrorText>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        size="medium"
                        disabled={serverState.submitting || !data?.productos?.length}
                    >
                        {serverState.submitting ? "Creando Cotización..." : "Generar Cotización en Odoo"}
                    </Button>
                    
                    {serverState.status && (
                        <p className={`mt-4 font-14 ${!serverState.status.ok ? "text-danger" : "text-success"}`}>
                            {serverState.status.msg}
                        </p>
                    )}
                </form>
                
                {serverState.submitting && (
                    <div className="mt-3 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Creando cotización en Odoo, por favor espere...</p>
                    </div>
                )}
            </div>
        </>
    );
};

NotificationArea.propTypes = {
    data: PropTypes.shape({
        notifications: PropTypes.array,
        productos: PropTypes.array,
        vaciarCarrito: PropTypes.func,
    }),
};

export default NotificationArea;