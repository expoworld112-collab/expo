import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';
import { withRouter } from 'next/router';
import { signup } from '../../../../actions/auth';
import styles from "../../../../styles/signup.module.css";


const ActivateAccount = ({ router }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        error: '',
        loading: false,
        success: false,
        showButton: true
    });

    const { name, token, error, loading, success, showButton } = values;

    useEffect(() => {
        let token = router.query.id;
        if (token) {
            const { name } = jwt.decode(token);
            setValues({ ...values, name, token });
        }
    }, [router]);

    const clickSubmit = e => {
        e.preventDefault();
        setValues({ ...values, loading: true, error: false });
        signup({ token }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false, showButton: false });
            } else {
                setValues({ ...values, loading: false, success: true, showButton: false });
            }



            
        });
    };

    const showLoading = () => (loading ? <h2>Loading...</h2> : '');
    const showError = () => (error ? <div className={styles.showError}>{error}</div> : '');
    const showMessage = () => (success ? <div className={styles.showMessage}>You have successfully activated your account. Please signin</div> : '');

    return (
        <Layout>
           <div  style={{textAlign:"center"}}>
                <br/><br/><br/><br/>
                <h2 style={{padding:"8px"}}>Hey {name}, Click on This Button to Activate Your Account</h2>
                {showLoading()}

               {/* <div className={styles.showError} > {error && error}</div> */}
              {/* <div className={styles.showMessage}>  {success && 'You have successfully activated your account. Please signin.'}</div> */}

              {showError()}
                {showMessage()}
                {showButton && (
                    <button onClick={clickSubmit} className={styles.button0000}>
                        Activate Account
                    </button>
                )}
                <br/><br/><br/><br/>
            </div>
            
        </Layout>
    );
};

export default withRouter(ActivateAccount);