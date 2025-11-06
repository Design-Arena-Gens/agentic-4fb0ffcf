"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import styles from './page.module.css';
import { SlidePlayer } from '../components/SlidePlayer';
import { LectureControls } from '../components/LectureControls';
import { LecturerAvatar } from '../components/LecturerAvatar';
import { exportSlidesToPdf } from '../utils/exportPdf';

const slides = [
  {
    id: 'intro',
    title: 'Journal Entries: From Start to Finish',
    bullets: [
      'Purpose: record financial events systematically',
      'Each entry has equal debits and credits',
      'Follows the accounting equation',
    ],
    narration:
      'Welcome! In this lecture, we will learn journal entries from start to finish: the purpose, the rules of debit and credit, the steps, examples, and how entries post to the ledger and trial balance.',
  },
  {
    id: 'equation',
    title: 'Accounting Equation',
    bullets: [
      'Assets = Liabilities + Equity',
      'Debits increase assets and expenses',
      'Credits increase liabilities, equity, and revenue',
    ],
    narration:
      'Always remember the accounting equation: assets equal liabilities plus equity. Debits typically increase assets and expenses, while credits increase liabilities, equity, and revenue.',
  },
  {
    id: 'steps',
    title: 'Steps to Create a Journal Entry',
    bullets: [
      '1) Identify the transaction and accounts',
      '2) Determine debit or credit by impact',
      '3) Record date, accounts, amounts, and explanation',
      '4) Verify debits equal credits',
    ],
    narration:
      'The steps are: identify the transaction and the accounts affected, determine whether each account is debited or credited, record the date, accounts, amounts and a clear explanation, and verify debits equal credits.',
  },
  {
    id: 'example1',
    title: 'Example 1: Cash Sale $500',
    bullets: [
      'Debit: Cash 500',
      'Credit: Sales Revenue 500',
      'Explanation: Sold goods for cash',
    ],
    narration:
      'For a cash sale of five hundred, debit cash for five hundred and credit sales revenue for five hundred. The explanation is simple: sold goods for cash.',
  },
  {
    id: 'example2',
    title: 'Example 2: Pay Rent $800',
    bullets: [
      'Debit: Rent Expense 800',
      'Credit: Cash 800',
      'Explanation: Paid monthly office rent',
    ],
    narration:
      'For paying rent of eight hundred, debit rent expense for eight hundred and credit cash for eight hundred. This increases expense and decreases cash.',
  },
  {
    id: 'posting',
    title: 'Posting to Ledger and Trial Balance',
    bullets: [
      'Transfer each debit and credit to ledger accounts',
      'Compute balances of each account',
      'Prepare a trial balance: total debits = total credits',
    ],
    narration:
      'After recording in the journal, post each debit and credit to the respective ledger accounts, compute balances, and then prepare a trial balance confirming that total debits equal total credits.',
  },
  {
    id: 'wrap',
    title: 'Wrap Up',
    bullets: [
      'Identify, analyze, record, and verify',
      'Consistency and clarity in explanations',
      'Debits must always equal credits',
    ],
    narration:
      'To wrap up: identify, analyze, record, and verify. Keep explanations clear and consistent. And never forget: debits must always equal credits.',
  },
];

export default function Page() {
  const [isDark, setIsDark] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  const handleExportPdf = useCallback(async () => {
    const container = document.getElementById('slides-container');
    if (!container) return;
    await exportSlidesToPdf(container, 'Journal-Entries-Lecture.pdf');
  }, []);

  const onSpeakingChange = useCallback((speaking) => setIsSpeaking(speaking), []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Journal Entry Lecture</h1>
        <div className={styles.headerActions}>
          <button onClick={() => setIsDark((v) => !v)} aria-label="Toggle dark mode">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleExportPdf}>Download Slides (PDF)</button>
        </div>
      </header>

      <section className={styles.stage}>
        <div className={styles.leftPane}>
          <LecturerAvatar speaking={isSpeaking} />
          <LectureControls playerRef={playerRef} />
        </div>
        <div className={styles.rightPane} id="slides-container">
          <SlidePlayer
            ref={playerRef}
            slides={slides}
            onSpeakingChange={onSpeakingChange}
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          Tip: Click Play to hear narration. Captions show the script. Use PDF to save slides.
        </p>
      </footer>
    </main>
  );
}
