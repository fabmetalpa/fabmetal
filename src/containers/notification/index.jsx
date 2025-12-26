import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import NiceSelect from "@ui/nice-select";
import NoticeCard from "@components/notice-card";
import { IDType, ImageType } from "@utils/types";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configuración de conexión a Odoo
const ODOO_CONFIG = {
    url: 'https://fabmetal.odoo.com',
    db: 'fabmetal',
    username: "admin@fabmetal.com.pa",
    password: "#Fabmetal1*/"
};

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

    // Función para autenticarse en Odoo
    const authenticateOdoo = async () => {
        try {
            const authRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'common',
                        method: 'authenticate',
                        args: [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.password, {}]
                    },
                    id: 1
                })
            });
            
            const authData = await authRes.json();
            return authData.result;
        } catch (error) {
            console.error("Error de autenticación Odoo:", error);
            throw new Error("No se pudo conectar con el sistema");
        }
    };

    // Función para buscar o crear cliente en Odoo
    const findOrCreatePartner = async (uid, formData) => {
        try {
            // Primero buscar por email
            const searchRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'res.partner',
                            'search_read',
                            [
                                [['email', '=', formData.correo]]
                            ],
                            { fields: ['id'], limit: 1 }
                        ]
                    },
                    id: 2
                })
            });
            
            const searchData = await searchRes.json();
            
            if (searchData.result && searchData.result.length > 0) {
                return searchData.result[0].id; // Retornar ID del partner existente
            }
            
            // Si no existe, crear nuevo partner
            const createRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'res.partner',
                            'create',
                            [{
                                name: formData.nombre,
                                email: formData.correo,
                                phone: formData.telefono,
                                street: formData.direccion || '',
                                contacto: formData.contacto || '',
                                type: 'contact',
                                company_type: 'person'
                            }]
                        ]
                    },
                    id: 3
                })
            });
            
            const createData = await createRes.json();
            return createData.result; // Retornar ID del nuevo partner
        } catch (error) {
            console.error("Error al buscar/crear partner:", error);
            throw error;
        }
    };

    // Función para obtener el product.product ID (variante) a partir de product.template ID
    const getProductVariantId = async (uid, productTemplateId) => {
        try {
            const searchRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'product.product',
                            'search_read',
                            [
                                [['product_tmpl_id', '=', productTemplateId]]
                            ],
                            { 
                                fields: ['id', 'display_name'],
                                limit: 1 
                            }
                        ]
                    },
                    id: 4
                })
            });
            
            const searchData = await searchRes.json();
            
            if (!searchData.result || searchData.result.length === 0) {
                throw new Error(`No se encontró variante para el producto ID: ${productTemplateId}`);
            }
            
            return searchData.result[0].id;
        } catch (error) {
            console.error("Error al obtener variante:", error);
            throw error;
        }
    };

    // Función para crear la cotización en Odoo
    const createQuotationInOdoo = async (uid, partnerId, cartItems, formData) => {
        try {
            // Preparar las líneas de la cotización
            const orderLines = [];
            
            for (const item of cartItems) {
                // Obtener la variante del producto (product.product)
                const productId = await getProductVariantId(uid, item.id);
                
                orderLines.push([0, 0, {
                    product_id: productId,
                    product_uom_qty: item.cantidad || 1,
                    price_unit: item.price || 0,
                    name: item.name,
                    product_uom: 1 // Unidad por defecto
                }]);
            }
            
            // Crear la cotización (sale.order en Odoo)
            const createRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'sale.order',
                            'create',
                            [{
                                partner_id: partnerId,
                                date_order: new Date().toISOString(),
                                validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días de validez
                                note: formData.mensaje,
                                client_order_ref: `WEB-${Date.now()}`,
                                order_line: orderLines,
                                state: 'draft', // Estado: borrador
                                require_payment: false,
                                require_signature: false
                            }]
                        ]
                    },
                    id: 5
                })
            });
            
            const createData = await createRes.json();
            
            // Confirmar la cotización (pasar a estado "cotizado")
            const confirmRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'sale.order',
                            'action_confirm',
                            [[createData.result]]
                        ]
                    },
                    id: 6
                })
            });
            
            const confirmData = await confirmRes.json();
            
            // Obtener el número de cotización para mostrar al usuario
            const readRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'sale.order',
                            'read',
                            [[createData.result]],
                            { fields: ['name'] }
                        ]
                    },
                    id: 7
                })
            });
            
            const readData = await readRes.json();
            
            return {
                success: true,
                orderId: createData.result,
                orderNumber: readData.result[0]?.name || createData.result
            };
        } catch (error) {
            console.error("Error al crear cotización:", error);
            throw error;
        }
    };

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
            
            console.log("📋 Datos del formulario:", formData);
            console.log("🛒 Productos en carrito:", prodsCart);
            
            // 1. Autenticarse en Odoo
            const uid = await authenticateOdoo();
            console.log("✅ Autenticación exitosa, UID:", uid);
            
            // 2. Buscar o crear cliente
            const partnerId = await findOrCreatePartner(uid, formData);
            console.log("✅ Cliente procesado, Partner ID:", partnerId);
            
            // 3. Crear cotización
            const quotationResult = await createQuotationInOdoo(uid, partnerId, prodsCart, formData);
            console.log("✅ Cotización creada:", quotationResult);
            
            // 4. Mostrar éxito
            toast.success(`✅ Cotización creada exitosamente! Número: ${quotationResult.orderNumber}`);
            
            // 5. Preparar mensaje para WhatsApp (opcional)
            let mensajeWsp = `*Nueva Cotización Web - ${quotationResult.orderNumber}*%0A%0A`;
            mensajeWsp += `*Cliente:* ${formData.nombre}%0A`;
            mensajeWsp += `*Contacto:* ${formData.contacto}%0A`;
            mensajeWsp += `*Teléfono:* ${formData.telefono}%0A`;
            mensajeWsp += `*Email:* ${formData.correo}%0A`;
            mensajeWsp += `*Mensaje:* ${formData.mensaje}%0A%0A`;
            mensajeWsp += `*Productos:*%0A`;
            
            let total = 0;
            prodsCart.forEach((prod, index) => {
                const subtotal = (prod.price || 0) * (prod.cantidad || 1);
                total += subtotal;
                mensajeWsp += `${index + 1}. ${prod.name} - Cant: ${prod.cantidad || 1} - $${prod.price || 0}%0A`;
            });
            
            mensajeWsp += `%0A*Total:* $${total}%0A`;
            
            // 6. Limpiar carrito
            localStorage.removeItem("productosGlobal");
            if (data && data.vaciarCarrito) {
                data.vaciarCarrito([]);
            }
            
            // 7. Opcional: Redirigir a WhatsApp
            setTimeout(() => {
                const whatsappUrl = `https://wa.me/50768055616?text=${mensajeWsp}`;
                window.open(whatsappUrl, '_blank');
            }, 2000);
            
            setServerState({ 
                submitting: false, 
                status: { ok: true, msg: "Cotización creada exitosamente" } 
            });
            
        } catch (error) {
            console.error("❌ Error en cotización:", error);
            toast.error(`Error al crear cotización: ${error.message}`);
            setServerState({ 
                submitting: false, 
                status: { ok: false, msg: error.message } 
            });
        }
    };

    // Resto del código permanece igual...
    const [current, setCurrent] = useState("newest");
    const [notifications, setNotifications] = useState([]);

    const changeHandler = (item) => {
        setCurrent(item.value);
    };

    const filterHandler = useCallback(() => {
        const allNotifications = data.notifications;
        const filterdSellers = allNotifications.filter(
            (noti) => noti.type === current
        );
        setNotifications(filterdSellers);
    }, [current, data.notifications]);

    let total = 0;
    for (let i = 0; i < data.productos.length; i++) total += Number(data.productos[i].precioTotal);

    useEffect(() => {
        filterHandler();
    }, [filterHandler]);

    return (
        <>
            <br/><br/>
            <ToastContainer position="top-right" autoClose={5000} />
            
            <div className="rn-notification-area right-fix-notice ">
                <div className="h--100">
                    <div className="notice-heading">
                        <h4>Resumen del Carrito</h4>
                        {data.productos.map((prod, index) => (
                            <div key={index} style={{marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee'}}>
                                <strong>{prod.name}</strong><br/>
                                Cantidad: {prod.cantidad} | Precio: ${prod.price}<br/>
                                Subtotal: ${prod.precioTotal}
                            </div>
                        ))}
                        <h4>Total: ${total}</h4>
                    </div>
                    
                    <div className="notice-heading mt-4">
                        <h4>Complete el formulario para generar su cotización en Odoo</h4>
                        <p>Una vez enviado, se creará automáticamente una cotización en nuestro sistema y nos pondremos en contacto.</p>
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
                        />
                        {errors.nombre && (
                            <ErrorText>{errors.nombre?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="contacto" className="form-label">
                            Persona de Contacto *
                        </label>
                        <input
                            id="contacto"
                            type="text"
                            {...register("contacto", {
                                required: "Contacto es requerido",
                            })}
                            disabled={serverState.submitting}
                        />
                        {errors.contacto && (
                            <ErrorText>{errors.contacto?.message}</ErrorText>
                        )}
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
                            type="text"
                            {...register("telefono", {
                                required: "Teléfono es requerido",
                            })}
                            disabled={serverState.submitting}
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
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="mensaje" className="form-label">
                            Mensaje o Comentarios *
                        </label>
                        <textarea
                            id="mensaje"
                            rows="3"
                            {...register("mensaje", {
                                required: "Mensaje es requerido",
                            })}
                            disabled={serverState.submitting}
                            placeholder="Ej: Necesito esta cotización para aprobación de gerencia, por favor incluir descuento por volumen"
                        />
                        {errors.mensaje && (
                            <ErrorText>{errors.mensaje?.message}</ErrorText>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        size="medium"
                        disabled={serverState.submitting}
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
        notifications: PropTypes.arrayOf(
            PropTypes.shape({
                id: IDType,
                title: PropTypes.string,
                description: PropTypes.string,
                path: PropTypes.string,
                date: PropTypes.string,
                time: PropTypes.string,
                image: ImageType,
            })
        ),
        productos: PropTypes.array,
        vaciarCarrito: PropTypes.func,
    }),
};

export default NotificationArea;