import { useState } from 'react'
import Logo from "../NavBar/Logo";
import styles from './purchase.module.css'

const Nav = ({ phase }) => {
    return (
        <div style={{width: '100%', borderBottom: '1px solid #ececec'}}>
            <div className={styles.navContainer}>
                <div className={styles.logoContainer}>
                    <Logo />
                    <div className={styles.secure}>
                        <i style={{fontSize: '16px', margin: '0 1rem'}} className="fa-solid fa-lock"></i>
                        Secure checkout
                    </div>
                </div>
                <div className={styles.phases}>
                    <div className={styles.line}></div>
                    <div className={styles.phase}>
                        { phase === 1 && <button className={styles.currentPhase} /> }
                        <button className={styles.phasePoint} />
                        <div className={styles.phaseLabel}>Shipping</div>
                    </div>
                    <div className={styles.phase}>
                        { phase === 2 && <button className={styles.currentPhase} /> }
                        <button className={styles.phasePoint} />
                        <div className={styles.phaseLabel}>Payment</div>
                    </div>
                    <div className={styles.phase}>
                        { phase === 3 && <button className={styles.currentPhase} /> }
                        <button className={styles.phasePoint} />
                        <div className={styles.phaseLabel}>Review</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav
