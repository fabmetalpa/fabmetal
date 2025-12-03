import { useState } from "react";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import axios from "axios";
import { useForm } from "react-hook-form";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
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
    const onSubmit = async (e) => {
        console.log(e)

        const form = new FormData();
        form.append("your-name", e.nombre);
        form.append("your-email", e.correo);
        form.append("your-subject", e.asunto);
        form.append("your-message", e.mensaje);

        var requestOptions = {
            method: 'POST',
            body: form,
            redirect: 'follow'
        };

        fetch("https://puromusculos.com/wordpress/wp-json/contact-form-7/v1/contact-forms/937/feedback", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        toast("Se envio su información");
        setTimeout(function () {
            window.location.href = "/";
        }, 4000);

    }



    return (
        <div className="form-wrapper-one registration-area">
            <h3 className="mb--30">Contactanos</h3>
            <form
                className="rwt-dynamic-form"
                id="contact-form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="mb-5">
                    <label htmlFor="nombre" className="form-label">
                        Tu nombre
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        {...register("nombre", {
                            required: "Nombre es requerido",
                        })}
                    />
                    {errors.nombre && (
                        <ErrorText>{errors.nombre?.message}</ErrorText>
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
                            required: "Correo es requerido",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Correo invalido",
                            },
                        })}
                    />
                    {errors.correo && (
                        <ErrorText>{errors.correo?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5">
                    <label htmlFor="asunto" className="form-label">
                        Asunto
                    </label>
                    <input
                        name="asunto"
                        type="text"
                        {...register("asunto", {
                            required: "Asunto es requerido",
                        })}
                    />
                    {errors.asunto && (
                        <ErrorText>{errors.asunto?.message}</ErrorText>
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
                    Enviar Mensaje
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
    );
};
export default ContactForm;
