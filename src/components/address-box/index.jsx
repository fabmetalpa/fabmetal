import PropTypes from "prop-types";
import clsx from "clsx";
import { FaTelegramPlane } from "react-icons/fa";

const AddressBox = ({
    className,
    icon,
    title,
    phoneNumbers,
    emails,
    address,
}) => (
    <div className={clsx("rn-address", className)}>
        <div className="icon">
        <p className="display-3"> <i className={icon}  /></p>
        </div>
        <div className="inner">
            <h4 className="title">{title}</h4>
            {phoneNumbers?.map((phone) => (
                <p key={phone}>
                    <a href={`tel:${phone.replace(/\s/g, "")}`}  target="_blank">{phone}</a>
                </p>
            ))}
            {emails?.map((email) => (
                <p key={email}>
                    <a href={`mailto:${email}`}  target="_blank">{email}</a>
                </p>
            ))}
            {address && 
                <a href={`https://www.instagram.com/fabmetalpa/`} target="_blank">
                    <p dangerouslySetInnerHTML={{ __html: address }} />
                </a>
            }
        </div>
    </div>
);

AddressBox.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    phoneNumbers: PropTypes.arrayOf(PropTypes.string),
    emails: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.string,
};
export default AddressBox;
