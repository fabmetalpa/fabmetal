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
    const handleServerResponse = (ok, msg, form) => {
        setServerState({
            submitting: false,
            status: { ok, msg },
        });
        if (ok) {
            form.reset();
        }
    };

    /*const onSubmit = (data, e) => {
        const form = e.target;
        setServerState({ submitting: true });
        axios({
            method: "post",
            url: "https://getform.io/f/7a6695a7-c8e3-442c-bc2f-d46d3b9a535e",
            data,
        })
            .then((_res) => {
                handleServerResponse(true, "Thanks! for being with us", form);
            })
            .catch((err) => {
                handleServerResponse(false, err.response.data.error, form);
            });
    };*/


    const onSubmit = async (e) => {
        console.log(data)

        var prodsCart = JSON.parse(localStorage.getItem("productosGlobal"));
        console.log(prodsCart);
        var prodItems = {};

        for (var i = 0; i < prodsCart.length; i++) {
            prodItems[i] = {};
            prodItems[i].product_id = prodsCart[i].id;
            prodItems[i].quantity = 1;
            prodItems[i].sku = "0";
        }


        var data3 = {
            payment_method: "",
            payment_method_title: "",
            set_paid: false,
            customer_note: e.mensaje,
            billing: {
                first_name: e.nombre,
                last_name: e.contacto,
                address_1: "",
                address_2: "",
                city: "",
                state: "",
                postcode: "",
                country: "",
                email: e.correo,
                phone: e.telefono
            },
            shipping: {
                first_name: e.nombre,
                last_name: e.nombre,
                address_1: e.direccion,
                address_2: "",
                city: "",
                state: "",
                postcode: "",
                country: ""
            },
            line_items:
                prodItems
            ,
            shipping_lines: [
                {
                    method_id: "flat_rate",
                    method_title: "Envio",
                    total: "15.00"
                }
            ]
        };


        var formdata = new FormData();
        formdata.append("data", data3);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic Y2tfM2Q5MjA1YjBmNzIwMjM5ZWRkMDJhYTRiOGY1ZjVkOGZkNWUwZDhjODpjc181OWMxYzY3NjExZTE1NGY1MjFiNzNjOTM5MjgxOTIwM2QyNWM3MDQ4");
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            body: JSON.stringify(data3),
            headers: myHeaders,
            redirect: 'follow'
        };

        const data2 = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/orders", requestOptions)
        const resulta = await data2.json();
        console.log(resulta)
        if (resulta.message) {
            toast("Ocurrio un problema creando la cotización");
        }



        if (resulta.status) {
            toast("Se creo su cotización, pronto lo contataremos");

            let mensajeProd = "%2A";
            let misDatos = "%2A";

            for (var i = 0; i < prodsCart.length; i++) {

                mensajeProd = mensajeProd + prodsCart[i].name + "," + "%20" + "Precio Unidad: " + prodsCart[i].price + ", Cantidades: " + prodsCart[i].cantidad + ", Precio Total: " + prodsCart[i].precioTotal + "%0A";
            }

            mensajeProd = mensajeProd + "Envio " + "%20" + "15.00" + "%0A";

            let totalEnvio = total + 15;

            mensajeProd = mensajeProd + "Total a Pagar" + "%20" + totalEnvio + "%0A";

            misDatos = "Mis datos Personales%0A";
            misDatos = misDatos + "Mi nombre:" + "%20" + e.nombre + "%0A";
            misDatos = misDatos + "Mi Telefono:" + "%20" + e.telefono + "%0A";
            misDatos = misDatos + "Mi Correo:" + "%20" + e.correo + "%0A";
            misDatos = misDatos + "Mi Direccion:" + "%20" + e.direccion + "%0A";
            misDatos = misDatos + "Mi Mensaje:" + "%20" + e.mensaje + "%0A";







            let productosParaWsp = prodsCart.map(producto => producto.name);
            console.log(JSON.stringify(productosParaWsp));
            window.location.href = 'https://wa.me/send/?phone=584125735972&text=Saludos, Me%20interesan%20los%20siguientes%20items%0AProductos:%0A' + ' ' + mensajeProd + ' ' + misDatos // Comento esta línea para no redirigir realmente en este ejemplo


            data.vaciarCarrito([]);
            //  window.location.href = "/";
        }





    }





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

    console.log(data);

    let total = 0;
    for (let i = 0; i < data.productos.length; i++) total += Number(data.productos[i].precioTotal);

    console.log(total);

    useEffect(() => {
        filterHandler();
    }, [filterHandler]);
    return (
        <>
            <br/><br/>
            <div className="rn-notification-area right-fix-notice ">
                <div className="h--100">
                    {/*<div className="notice-heading">

                        <h4>Sub Total:</h4>
                        <Button color="primary" size="small">
                            {total} €
                        </Button>


                    </div>

                    <div className="notice-heading">

                        <h4>Envio:</h4>
                        <Button color="primary" size="small">
                            {15} €
                        </Button>


                    </div>*/}

                    <div className="notice-heading">

                        <h4>Total :</h4>
                        <Button color="primary" size="small">
                           $ {total} 
                        </Button>


                    </div>
                </div>

            </div>










            <div className="form-wrapper-one registration-area mt--50">
                <h3 className="mb--30">Cotizar</h3>
                <form
                    className="rwt-dynamic-form"
                    id="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-5">
                        <label htmlFor="nombre" className="form-label">
                            Razón Social
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            {...register("nombre", {
                                required: "Nombre es requerido",
                            })}
                        />
                        {errors.contactName && (
                            <ErrorText>{errors.nombre?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="contacto" className="form-label">
                            Contacto
                        </label>
                        <input
                            id="contacto"
                            type="text"
                            {...register("contacto", {
                                required: "Contacto es requerido",
                            })}
                        />
                        {errors.contactName && (
                            <ErrorText>{errors.contacto?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="correo" className="form-label">
                            Correo
                        </label>
                        <input
                            name="correo"
                            type="email"
                            {...register("correo", {
                                required: "Correo es requeirod",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "El correo es invalido",
                                },
                            })}
                        />
                        {errors.correo && (
                            <ErrorText>{errors.correo?.message}</ErrorText>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="telefono" className="form-label">
                            Telefono
                        </label>
                        <input
                            name="telefono"
                            type="text"
                            {...register("telefono", {
                                required: "Teléfono es requerido",
                            })}
                        />
                        {errors.telefono && (
                            <ErrorText>{errors.telefono?.message}</ErrorText>
                        )}
                    </div>
                   
                    <div className="mb-5">
                        <label htmlFor="mensaje" className="form-label">
                            Mensaje
                        </label>
                        <textarea
                            id="mensaje"
                            rows="3"
                            {...register("mensaje", {
                                required: "Mensaje es requerido",
                            })}
                        />
                        {errors.mensaje && (
                            <ErrorText>{errors.mensaje?.message}</ErrorText>
                        )}
                    </div>

                    <Button type="submit" size="medium">
                        Enviar Cotización
                    </Button>
                    {serverState.status && (
                        <p
                            className={`mt-4 font-14 ${!serverState.status.ok
                                ? "text-danger"
                                : "text-success"
                                }`}
                        >
                            {serverState.status.msg}
                        </p>
                    )}
                </form>
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
    }),
};

export default NotificationArea;
