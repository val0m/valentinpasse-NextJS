import styles from "./hr.module.css";

export function Hr() {
    return (
        <div className={styles.hr} aria-hidden="true">
            <span className={styles.dot} />
        </div>
    );
}