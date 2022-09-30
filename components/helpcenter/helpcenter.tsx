import styles from './helpcenter.module.scss'
import Link from 'next/link'

const HelpCenter: React.FC = () => {
  return (
    <section className={styles.helpcenter}>
      <h3> Help Center</h3>
      <Link href="/helpcenter">
        <a className="btnLearnMore">Learn More</a>
      </Link>
    </section>
  )
}

export default HelpCenter
