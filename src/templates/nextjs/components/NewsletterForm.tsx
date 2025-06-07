import { useState } from 'react';
import { addToMailingList } from '../firebase/mailingList';
import styles from './NewsletterForm.module.scss';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addToMailingList(email);
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className={styles.input}
      />
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className={styles.button}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      
      {status === 'success' && (
        <p className={`${styles.message} ${styles.success}`}>Thanks for subscribing!</p>
      )}
      {status === 'error' && (
        <p className={`${styles.message} ${styles.error}`}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
} 