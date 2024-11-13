import { Html } from "@react-three/drei";
import Backdrop from "./Backdrop";

const Spinner = () => (
    <>
        <Backdrop />
        <Html center>
            <div className="spinner-border" style={{ width: '50px', height: '50px' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </Html>
    </>
);

export default Spinner