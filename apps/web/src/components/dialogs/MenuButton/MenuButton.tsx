import styles from './MenuButton.module.css';
import { useRef } from 'react';
import { useModal } from '@/hooks/useModal';
import { NavLink } from 'react-router';
import { ThemeButton } from '../ThemeButton/ThemeButton';
import { FILTERS_KEYS } from '@/consts/filtersConsts';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { motion, stagger, type Variants } from 'motion/react';
import { CategoryLink } from '../../categories/CategoryLink/CategoryLink';
import { AllProductsLink } from '../../products/AllProductsLink/AllProductsLink';
import { House, Info, ShoppingBag, User, Menu, X, Star } from 'lucide-react';

const dialogVariants: Variants = {
  close: {
    x: '-100%',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      when: 'afterChildren',
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const linksVariants: Variants = {
  close: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.05,
      ease: 'easeOut',
    },
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
};
const optionsVariants: Variants = {
  close: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.05,
      ease: 'easeOut',
    },
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
};

const linksListVariants: Variants = {
  close: {
    transition: {
      when: 'afterChildren',
      delayChildren: stagger(0.05, { from: 'last' }),
    },
  },
  open: {
    transition: {
      delayChildren: stagger(0.1, { startDelay: 0.2 }),
    },
  },
};
const optionsListVariants: Variants = {
  close: {
    transition: {
      when: 'afterChildren',
      delayChildren: stagger(0.05, { from: 'last' }),
    },
  },
  open: {
    transition: {
      delayChildren: stagger(0.1, { startDelay: 0.2 }),
    },
  },
};

export function MenuButton() {
  const { categories } = useCategoriesStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isOpening, startClosing, close, open } = useModal({
    dialogRef,
    autoClose: true,
    shouldHideScrollbar: true,
    controlTheTransitions: true,
  });

  return (
    <>
      <button className={styles.openDialog} onClick={open} aria-label="open menu">
        <Menu />
      </button>

      <motion.dialog
        variants={dialogVariants}
        initial={isOpening ? 'open' : 'close'}
        animate={isOpening ? 'open' : 'close'}
        onAnimationComplete={(variant) => {
          if (variant === 'close') close();
        }}
        ref={dialogRef}
        className={styles.menuDialog}
      >
        <div className={styles.dialogFlex}>
          <button className={styles.closeBtn} onClick={startClosing} aria-label="close menu">
            <X />
          </button>

          <h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1f1f1f"
            >
              <path d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z" />
            </svg>
            Trending Market
          </h2>

          <motion.nav className={styles.nav} variants={linksListVariants}>
            <ul>
              <motion.li variants={linksVariants}>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? styles.active : '')}
                  onClick={() => startClosing()}
                >
                  <House />
                  Home
                </NavLink>
              </motion.li>
              <motion.li variants={linksVariants}>
                <AllProductsLink className={styles.active} onClick={() => startClosing()}>
                  <ShoppingBag />
                  Products
                </AllProductsLink>
              </motion.li>
              <motion.li variants={linksVariants}>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? styles.active : '')}
                  onClick={() => startClosing()}
                >
                  <Info />
                  About
                </NavLink>
              </motion.li>
            </ul>
            <motion.hr variants={linksVariants} />
            <motion.ul variants={linksVariants}>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <CategoryLink
                    to={{ pathname: '/products', search: `?${FILTERS_KEYS.CATEGORY}=${cat.slug}` }}
                    className={styles.active}
                    onClick={() => startClosing()}
                  >
                    • {cat.name}
                  </CategoryLink>
                </li>
              ))}
            </motion.ul>
          </motion.nav>

          <motion.ul className={styles.options} variants={optionsListVariants}>
            <motion.li variants={optionsVariants}>
              <a
                className={styles.gitHub}
                aria-label="github repository"
                href="https://github.com/hesedcrz19/trending-market"
                target="_blank"
                rel="noreferrer author"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z" />
                </svg>
              </a>
            </motion.li>
            <motion.li variants={optionsVariants}>
              <ThemeButton
                containerClassName={styles.themeContainer}
                buttonClassName={styles.theme}
                dialogDirection="up"
              />
            </motion.li>
            <motion.li variants={optionsVariants}>
              <button className={styles.cart}>
                <Star />
              </button>
            </motion.li>
            <motion.li variants={optionsVariants}>
              <button className={styles.account}>
                <User />
              </button>
            </motion.li>
          </motion.ul>
        </div>
      </motion.dialog>
    </>
  );
}
