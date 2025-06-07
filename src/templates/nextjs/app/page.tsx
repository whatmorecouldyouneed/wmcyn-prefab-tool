import NewsletterForm from '../components/NewsletterForm';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to {{projectName}}</h1>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stay Updated</h2>
          <NewsletterForm />
        </section>
      </div>
    </main>
  );
} 