import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "@components/section-title/layout-02";
import { TextType, SectionTitleType } from "@utils/types";

const QuoteArea = ({ space, className, data }) => (
    <div
        className={clsx(
            "rn-about-Quote-area",
            space === 1 && "rn-section-gapTop",
            className
        )}
    >
        <div className="container">
            <div className="row g-5 d-flex align-items-center">
            <div className="col-lg-6">
                    <div
                        className="rn-about-wrapper"
                        data-sal="slide-up"
                        data-sal-duration="800"
                        data-sal-delay="150"
                    >
                        <h2>Visión </h2>
                        
                            <p>Ser una empresa reconocida por ofrecer la mejor calidad en el menor tiempo, con el fin de lograr el bien común, basándonos en diferentes tipos de estrategias. De esta manera plasmaremos grandes referencias y llegaremos a posicionar nuestra marca nacionalmente.</p>
                            <p>Existen muchos valores que conforman el punto de partida para cada uno de nuestros proyectos, en una empresa donde tenernos una cultura abierta, creando responsablemente comunicaciones amplias, buscando simplicidad y transparencia en nuestros procesos para lograr ofrecer un servicio de calidad y que sea percibido su valor por nuestros usuarios. </p>
                            <p>Agradecemos a nuestros clientes por las oportunidades que nos brindan día tras día.                            </p>
                    </div>
                </div>
                <div className="col-lg-6">
                    
                    <div
                        className="rn-about-wrapper"
                        data-sal="slide-up"
                        data-sal-duration="800"
                        data-sal-delay="150"
                    >
                        <h2> Ideas y Objetivos Claros</h2>
                            <p>Debemos comunicarnos como líderes en nuestra área, de una forma sobria, pero poderosa, siempre enfocados en mantener ese elemento diferenciador por el que nuestros clientes confían en nosotros.</p>
                    </div>
                </div>
            </div>


        </div>
    </div>
);

QuoteArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    data: PropTypes.shape({
        section_title: SectionTitleType,
        texts: PropTypes.arrayOf(TextType),
    }),
};

QuoteArea.defaultProps = {
    space: 1,
};

export default QuoteArea;
