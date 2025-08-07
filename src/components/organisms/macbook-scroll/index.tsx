'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MotionValue, motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';
import { IconWorld } from '@tabler/icons-react';
import { IconCommand } from '@tabler/icons-react';
import { IconCaretLeftFilled } from '@tabler/icons-react';
import { IconCaretDownFilled } from '@tabler/icons-react';

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className="flex min-h-[200vh] shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-50 md:scale-100 md:py-80"
    >
      <motion.h2
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="mb-20 text-center text-3xl font-bold text-neutral-800 dark:text-white"
      >
        {title || (
          <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>
        )}
      </motion.h2>
      {/* Lid */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      {/* Base area */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
        {/* above keyboard bar */}
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
        {showGradient && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black"></div>
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: 'perspective(800px) rotateX(-25deg) translateZ(0px)',
          transformOrigin: 'bottom',
          transformStyle: 'preserve-3d',
        }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div
          style={{
            boxShadow: '0px 2px 0px 2px #171717 inset',
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="text-white">
            <p>DataTram</p>
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: 'preserve-3d',
          transformOrigin: 'top',
        }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />

        <PurpleContactForm />
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{
        boxShadow: '0px 0px 1px 1px #00000020 inset',
      }}
    ></div>
  );
};

export const Keypad = () => {
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
      {/* First Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </div>

      {/* Second row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </KBtn>
        <KBtn>
          <span className="block">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn>
          <span className="block">&mdash;</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn
          className="w-10 items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          delete
        </KBtn>
      </div>

      {/* Third row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          tab
        </KBtn>
        <KBtn>
          <span className="block">Q</span>
        </KBtn>
        <KBtn>
          <span className="block">W</span>
        </KBtn>
        <KBtn>
          <span className="block">E</span>
        </KBtn>
        <KBtn>
          <span className="block">R</span>
        </KBtn>
        <KBtn>
          <span className="block">T</span>
        </KBtn>
        <KBtn>
          <span className="block">Y</span>
        </KBtn>
        <KBtn>
          <span className="block">U</span>
        </KBtn>
        <KBtn>
          <span className="block">I</span>
        </KBtn>
        <KBtn>
          <span className="block">O</span>
        </KBtn>
        <KBtn>
          <span className="block">P</span>
        </KBtn>
        <KBtn>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          caps lock
        </KBtn>
        <KBtn>
          <span className="block">A</span>
        </KBtn>
        <KBtn>
          <span className="block">S</span>
        </KBtn>
        <KBtn>
          <span className="block">D</span>
        </KBtn>
        <KBtn>
          <span className="block">F</span>
        </KBtn>
        <KBtn>
          <span className="block">G</span>
        </KBtn>
        <KBtn>
          <span className="block">H</span>
        </KBtn>
        <KBtn>
          <span className="block">J</span>
        </KBtn>
        <KBtn>
          <span className="block">K</span>
        </KBtn>
        <KBtn>
          <span className="block">L</span>
        </KBtn>
        <KBtn>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          shift
        </KBtn>
        <KBtn>
          <span className="block">Z</span>
        </KBtn>
        <KBtn>
          <span className="block">X</span>
        </KBtn>
        <KBtn>
          <span className="block">C</span>
        </KBtn>
        <KBtn>
          <span className="block">V</span>
        </KBtn>
        <KBtn>
          <span className="block">B</span>
        </KBtn>
        <KBtn>
          <span className="block">N</span>
        </KBtn>
        <KBtn>
          <span className="block">M</span>
        </KBtn>
        <KBtn>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          shift
        </KBtn>
      </div>

      {/* sixth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-[6px] w-[6px]" />
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
        >
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="w-[8.2rem]"></KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
        >
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBtn className="h-3 w-6">
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="h-3 w-6">
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretRightFilled className="h-[6px] w-[6px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  return (
    <div
      className={cn(
        '[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform]',
        backlit && 'bg-white/[0.2] shadow-xl shadow-white'
      )}
    >
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]',
          className
        )}
        style={{
          boxShadow:
            '0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset',
        }}
      >
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center text-[5px] text-neutral-200',
            childrenClassName,
            backlit && 'text-white'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={{
        backgroundImage:
          'radial-gradient(circle, #08080A 0.5px, transparent 0.5px)',
        backgroundSize: '3px 3px',
      }}
    ></div>
  );
};

export const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
};

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // width={438}
    // height={104}
    width="66"
    height="65"
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#CAC7FF"
        strokeWidth={9}
        d="M89.278 353.365h66.14c7.871 0 14.251-6.38 14.251-14.251V204.705c0-7.871 6.381-14.252 14.252-14.252h79.538"
      />
      <path
        stroke="#CAC7FF"
        strokeWidth={9}
        d="M89.278 244.921h66.369c7.871 0 14.251-6.38 14.251-14.251v-26.456c0-7.871 6.381-14.251 14.252-14.251h79.805M89.278 27.051h66.14c7.871 0 14.251 6.38 14.251 14.251v134.41c0 7.87 6.381 14.251 14.252 14.251h79.538"
      />
      <path
        stroke="#CAC7FF"
        strokeWidth={9}
        d="M89.278 135.495h66.369c7.871 0 14.251 6.381 14.251 14.251v26.456c0 7.871 6.381 14.251 14.252 14.251h79.805"
      />
      <path
        stroke="url(#b)"
        strokeLinecap="round"
        strokeWidth={8.907}
        d="M106.404 244.921h49.243c7.871 0 14.251-6.38 14.251-14.251v-26.456c0-7.871 6.381-14.251 14.251-14.251h79.806"
      />
      <path
        stroke="url(#c)"
        strokeLinecap="round"
        strokeWidth={8.907}
        d="M122.775 27.051h32.643c7.871 0 14.251 6.38 14.251 14.251v103.516"
      />
    </g>
    <path
      fill="#fff"
      d="M83.57 1H6.5A5.5 5.5 0 0 0 1 6.5v77.07a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5V6.5a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <path
      stroke="#AEAEC1"
      d="M83.57 1H6.5A5.5 5.5 0 0 0 1 6.5v77.07a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5V6.5a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <mask
      id="d"
      width={66}
      height={48}
      x={12}
      y={21}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'luminance',
      }}
    >
      <path fill="#fff" d="M77.813 21.877H12.257v46.316h65.556V21.877Z" />
    </mask>
    <g mask="url(#d)">
      <mask
        id="e"
        width={66}
        height={47}
        x={12}
        y={22}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="#fff" d="M12.257 22.007h65.159v46.186H12.257" />
      </mask>
      <g mask="url(#e)">
        <path
          fill="#129CD8"
          fillRule="evenodd"
          d="M39.372 27.044c2.1-2.217 5.026-3.592 8.262-3.592 4.302 0 8.054 2.428 10.053 6.034a13.75 13.75 0 0 1 5.681-1.223c7.758 0 14.048 6.425 14.048 14.35 0 7.926-6.29 14.35-14.048 14.35-.947 0-1.872-.096-2.767-.278-1.76 3.177-5.113 5.326-8.963 5.326-1.61 0-3.134-.377-4.492-1.048-1.783 4.25-5.94 7.23-10.784 7.23-5.045 0-9.345-3.232-10.995-7.766a10.68 10.68 0 0 1-2.235.236c-6.006 0-10.875-4.982-10.875-11.128 0-4.12 2.187-7.715 5.438-9.64-.67-1.56-1.041-3.28-1.041-5.09 0-7.067 5.666-12.798 12.655-12.798 4.104 0 7.75 1.976 10.063 5.037Z"
          clipRule="evenodd"
        />
      </g>
      <path
        fill="#FEFEFE"
        fillRule="evenodd"
        d="M21.694 45.957c-.041.109.015.13.028.15.122.09.246.154.371.227.665.357 1.293.46 1.95.46 1.336 0 2.166-.719 2.166-1.878v-.022c0-1.072-.937-1.461-1.815-1.742l-.115-.038c-.663-.218-1.235-.406-1.235-.848v-.022c0-.379.335-.657.853-.657a3.81 3.81 0 0 1 1.698.44s.13.085.177-.042l.272-.741c.025-.07-.02-.124-.065-.152a3.756 3.756 0 0 0-1.916-.521h-.133c-1.224 0-2.078.75-2.078 1.822v.022c0 1.13.942 1.498 1.825 1.753l.142.044c.644.2 1.198.373 1.198.83v.024c0 .419-.36.731-.941.731-.226 0-.945-.004-1.722-.501-.094-.057-.148-.096-.22-.141-.039-.024-.134-.066-.177.061l-.263.741ZM41.262 45.957c-.041.109.014.13.027.15.123.09.246.154.372.227.665.357 1.293.46 1.949.46 1.337 0 2.167-.719 2.167-1.878v-.022c0-1.072-.938-1.461-1.816-1.742l-.115-.038c-.662-.218-1.234-.406-1.234-.848v-.022c0-.379.334-.657.852-.657a3.81 3.81 0 0 1 1.698.44s.13.085.177-.042l.272-.741c.025-.07-.019-.124-.065-.152a3.754 3.754 0 0 0-1.915-.521h-.133c-1.224 0-2.078.75-2.078 1.822v.022c0 1.13.943 1.498 1.825 1.753l.142.044c.643.2 1.199.373 1.199.83v.024c0 .419-.361.731-.943.731-.226 0-.944-.004-1.722-.501-.093-.057-.149-.094-.22-.141-.024-.015-.137-.06-.175.061l-.264.741ZM54.62 43.687c0 .655-.121 1.171-.359 1.536-.235.36-.59.537-1.086.537-.496 0-.85-.176-1.081-.537-.235-.365-.353-.881-.353-1.536 0-.654.118-1.17.352-1.53.233-.357.586-.531 1.082-.531.495 0 .85.174 1.086.53.238.361.358.877.358 1.53Zm1.115-1.214a2.732 2.732 0 0 0-.508-.982 2.444 2.444 0 0 0-.857-.66 2.784 2.784 0 0 0-1.195-.243c-.453 0-.856.083-1.197.244a2.44 2.44 0 0 0-.856.66 2.722 2.722 0 0 0-.508.98c-.109.374-.164.782-.164 1.215 0 .432.055.842.164 1.214.11.374.28.705.508.981.227.277.516.498.857.655.341.157.743.237 1.196.237.452 0 .853-.08 1.195-.237.341-.157.63-.378.858-.654.226-.276.398-.607.507-.982a4.33 4.33 0 0 0 .165-1.214c0-.433-.056-.841-.165-1.214ZM64.897 45.585c-.037-.11-.143-.068-.143-.068-.162.063-.334.12-.52.15-.185.03-.39.044-.61.044-.54 0-.97-.163-1.277-.484-.307-.322-.48-.842-.479-1.545.002-.64.155-1.12.429-1.488.272-.364.686-.552 1.238-.552.46 0 .811.055 1.179.171 0 0 .088.039.129-.077.099-.276.17-.47.275-.772.03-.087-.043-.123-.07-.133a4.3 4.3 0 0 0-.744-.191 5.616 5.616 0 0 0-.837-.056c-.468 0-.886.08-1.243.242-.357.16-.659.382-.9.658-.239.277-.42.608-.541.982a3.928 3.928 0 0 0-.182 1.217c0 .937.249 1.694.742 2.248.494.557 1.235.84 2.202.84.572 0 1.158-.118 1.58-.285 0 0 .08-.04.045-.135l-.273-.766ZM66.849 43.06c.054-.364.152-.667.305-.903.231-.357.584-.555 1.08-.555.496 0 .822.198 1.058.556.156.236.224.55.25.902H66.85Zm3.756-.8a2.384 2.384 0 0 0-.483-.895c-.243-.266-.481-.45-.717-.553a2.718 2.718 0 0 0-1.082-.223c-.471 0-.9.08-1.247.246-.348.165-.64.39-.87.672-.228.28-.401.614-.511.993-.11.376-.166.786-.166 1.22 0 .441.058.852.172 1.22.115.374.299.701.547.974.248.273.567.486.95.637.38.148.841.226 1.37.224 1.092-.003 1.666-.25 1.903-.382.042-.025.081-.065.032-.184l-.248-.7c-.037-.104-.141-.066-.141-.066-.271.102-.655.284-1.55.282-.587 0-1.02-.175-1.293-.45-.278-.279-.416-.69-.44-1.27l3.777.002s.1-.001.11-.1c.004-.04.129-.785-.113-1.647ZM36.602 43.06c.054-.364.153-.667.305-.903.233-.357.584-.555 1.08-.555.496 0 .824.198 1.06.556.154.236.222.55.25.902h-2.695Zm3.756-.8a2.383 2.383 0 0 0-.482-.895c-.244-.266-.481-.45-.718-.553a2.72 2.72 0 0 0-1.08-.223c-.473 0-.901.08-1.249.246-.347.165-.64.39-.87.672-.228.28-.4.614-.51.993-.11.376-.166.786-.166 1.22 0 .441.057.852.171 1.22.115.374.299.701.547.974.249.273.568.486.95.637.38.148.842.226 1.371.224 1.091-.003 1.666-.25 1.902-.382.042-.025.082-.065.033-.184l-.248-.7c-.038-.104-.142-.066-.142-.066-.271.102-.654.284-1.55.282-.586 0-1.02-.175-1.292-.45-.279-.279-.417-.69-.44-1.27l3.776.002s.1-.001.11-.1c.004-.04.13-.785-.113-1.647ZM28.439 45.564c-.148-.12-.169-.15-.217-.227-.076-.118-.114-.284-.114-.498 0-.335.11-.578.337-.74 0 0 .325-.287 1.095-.276a7.536 7.536 0 0 1 1.026.088v1.74s-.48.103-1.02.136c-.768.047-1.11-.224-1.107-.223Zm1.503-2.688a8.066 8.066 0 0 0-.59-.017c-.323 0-.636.04-.93.121-.295.08-.56.205-.788.37-.23.166-.414.379-.548.631a1.857 1.857 0 0 0-.202.88c0 .34.057.634.173.874.115.242.28.444.492.599.21.155.47.268.77.337.296.07.632.104 1 .104a6.82 6.82 0 0 0 1.147-.097c.37-.064.825-.157.951-.187s.265-.068.265-.068c.093-.024.086-.125.086-.125l-.002-3.497c0-.768-.202-1.337-.6-1.69-.396-.35-.98-.528-1.735-.528a6.17 6.17 0 0 0-1.012.094s-.825.162-1.164.432c0 0-.074.046-.034.152l.267.727c.034.094.125.062.125.062s.028-.011.062-.032c.726-.4 1.645-.388 1.645-.388.408 0 .722.085.934.248.206.16.31.401.31.911v.162c-.324-.047-.622-.075-.622-.075ZM60.403 40.906a.104.104 0 0 0-.057-.137 3.39 3.39 0 0 0-.633-.11c-.475-.03-.738.051-.974.159-.234.107-.494.28-.637.477l-.001-.466c0-.064-.045-.116-.109-.116h-.968c-.063 0-.108.052-.108.116v5.705c0 .064.05.115.115.115h.992a.114.114 0 0 0 .114-.115v-2.85c0-.383.042-.764.126-1.004.08-.238.192-.427.33-.563.138-.135.295-.23.467-.284a1.8 1.8 0 0 1 .506-.072c.198 0 .414.052.414.052.074.008.114-.038.14-.104.064-.174.248-.699.283-.803Z"
        clipRule="evenodd"
      />
      <path
        fill="#FEFEFE"
        fillRule="evenodd"
        d="M51.09 38.262a2.977 2.977 0 0 0-.888-.13c-.682 0-1.22.196-1.599.582-.375.383-.63.967-.759 1.734l-.046.259h-.857s-.105-.004-.127.111l-.14.795c-.01.076.022.123.122.123h.835l-.847 4.787a6.04 6.04 0 0 1-.226.943c-.083.238-.164.415-.264.544-.096.124-.187.217-.345.27-.13.044-.28.065-.445.065-.09 0-.212-.016-.302-.034-.09-.018-.137-.038-.204-.066 0 0-.098-.038-.137.06l-.28.779c-.027.075.01.134.059.152.11.04.193.066.344.102.211.05.388.053.554.053.348 0 .665-.05.927-.145.264-.098.494-.266.698-.493.22-.246.358-.504.49-.856.132-.349.243-.781.333-1.285l.85-4.876h1.244s.105.004.126-.111l.141-.795c.01-.076-.022-.123-.122-.123h-1.208c.006-.028.06-.458.2-.863.059-.173.17-.312.264-.408a.79.79 0 0 1 .316-.2c.12-.038.256-.058.406-.058.113 0 .225.014.31.031.117.025.163.039.193.048.123.038.14.002.164-.058l.288-.803c.03-.087-.042-.124-.069-.134ZM34.217 46.533c0 .064-.045.117-.108.117h-1.002c-.063 0-.108-.053-.108-.117v-8.162c0-.064.045-.116.108-.116h1.002c.063 0 .108.052.108.116v8.162Z"
        clipRule="evenodd"
      />
    </g>
    <path
      fill="#fff"
      d="M83.57 98.977H6.5a5.5 5.5 0 0 0-5.5 5.5v77.069a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5v-77.069a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <path
      stroke="#AEAEC1"
      d="M83.57 98.977H6.5a5.5 5.5 0 0 0-5.5 5.5v77.069a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5v-77.069a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <mask
      id="f"
      width={46}
      height={48}
      x={22}
      y={119}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'luminance',
      }}
    >
      <path fill="#fff" d="M67.48 119.854H22.59v46.316h44.89v-46.316Z" />
    </mask>
    <g mask="url(#f)">
      <path
        fill="#000"
        d="M67.307 147.585c-.27-.815-.975-1.383-1.886-1.519-.43-.065-.923-.037-1.506.083-1.015.21-1.769.289-2.319.305 2.076-3.506 3.764-7.504 4.736-11.267 1.57-6.086.731-8.858-.25-10.112-2.596-3.319-6.385-5.102-10.955-5.156-2.438-.03-4.578.452-5.695.798a21.14 21.14 0 0 0-3.33-.305c-2.198-.035-4.14.444-5.8 1.43a26.458 26.458 0 0 0-4.097-1.029c-4.005-.658-7.234-.145-9.595 1.523-2.86 2.021-4.185 5.532-3.94 10.435.078 1.556.949 6.293 2.32 10.785.787 2.582 1.627 4.726 2.496 6.373 1.232 2.336 2.55 3.711 4.03 4.205.83.276 2.338.47 3.923-.851.201.244.47.486.825.71a5.488 5.488 0 0 0 1.556.656c1.989.498 3.852.373 5.441-.324.01.283.017.553.024.786.01.379.02.75.035 1.097.094 2.346.253 4.17.726 5.447.026.07.06.177.098.29.236.723.63 1.932 1.633 2.879 1.04.981 2.296 1.282 3.447 1.282.577 0 1.128-.076 1.611-.179 1.722-.369 3.678-.932 5.093-2.947 1.337-1.905 1.988-4.775 2.105-9.296l.043-.366.028-.239.315.028.082.005c1.753.08 3.898-.292 5.215-.904 1.04-.483 4.376-2.245 3.59-4.623Z"
      />
      <path
        fill="#336791"
        d="M64.308 148.048c-5.215 1.076-5.574-.69-5.574-.69 5.506-8.174 7.808-18.549 5.822-21.088-5.42-6.927-14.8-3.651-14.957-3.566l-.05.009a18.577 18.577 0 0 0-3.48-.362c-2.359-.039-4.149.619-5.507 1.649 0 0-16.734-6.897-15.956 8.674.165 3.312 4.746 25.063 10.209 18.493 1.997-2.402 3.926-4.434 3.926-4.434a5.06 5.06 0 0 0 3.308.845l.093-.079c-.029.298-.015.59.038.936-1.408 1.573-.994 1.849-3.807 2.428-2.847.587-1.175 1.632-.083 1.905 1.324.331 4.386.8 6.455-2.098l-.082.331c.551.442.939 2.874.874 5.079-.065 2.205-.109 3.718.326 4.901.434 1.182.867 3.842 4.566 3.05 3.09-.663 4.692-2.38 4.915-5.244.158-2.036.516-1.735.538-3.555l.287-.862c.331-2.76.053-3.65 1.957-3.236l.463.041c1.4.064 3.235-.226 4.311-.726 2.318-1.076 3.693-2.873 1.408-2.401Z"
      />
      <path
        fill="#fff"
        d="M41.541 134.155c-.47-.066-.895-.005-1.11.158a.409.409 0 0 0-.17.271c-.026.194.11.409.193.519.236.313.58.528.922.575.05.007.099.011.148.011.569 0 1.086-.444 1.132-.771.057-.41-.538-.683-1.115-.763Zm15.57.013c-.046-.321-.617-.413-1.16-.337-.54.075-1.066.32-1.022.641.035.251.487.678 1.022.678.045 0 .09-.003.137-.009.357-.05.619-.277.743-.407.19-.2.3-.422.28-.566Z"
      />
      <path
        fill="#fff"
        d="M66.043 147.926c-.199-.602-.839-.795-1.902-.576-3.157.652-4.288.201-4.66-.073 2.455-3.74 4.474-8.261 5.563-12.479.516-1.998.8-3.854.824-5.366.026-1.66-.257-2.88-.84-3.625-2.35-3.004-5.8-4.616-9.974-4.66-2.87-.032-5.296.703-5.766.909-.99-.246-2.07-.397-3.245-.417-2.154-.034-4.017.482-5.56 1.534-.669-.25-2.4-.844-4.517-1.186-3.66-.589-6.569-.142-8.644 1.329-2.477 1.755-3.62 4.892-3.398 9.325.074 1.491.923 6.079 2.264 10.472 1.764 5.783 3.682 9.057 5.7 9.73.236.079.509.134.81.134.735 0 1.638-.332 2.577-1.461a92.535 92.535 0 0 1 3.553-4.022 5.724 5.724 0 0 0 2.556.688l.006.069c-.153.183-.303.369-.45.557-.618.785-.747.948-2.735 1.357-.565.117-2.067.427-2.09 1.48-.023 1.151 1.776 1.634 1.981 1.685a8.478 8.478 0 0 0 2.06.268c1.596 0 3-.525 4.123-1.541-.035 4.103.136 8.145.629 9.377.403 1.008 1.388 3.472 4.5 3.472.457 0 .96-.053 1.512-.172 3.248-.696 4.658-2.132 5.204-5.298.292-1.692.793-5.732 1.029-7.899.497.155 1.137.226 1.83.226 1.443 0 3.109-.307 4.153-.792 1.174-.545 3.291-1.883 2.907-3.045Zm-7.734-14.645c-.01.64-.099 1.221-.192 1.827-.1.652-.204 1.326-.23 2.145-.026.796.073 1.624.17 2.425.194 1.617.393 3.283-.379 4.926a6.508 6.508 0 0 1-.342-.704c-.096-.232-.304-.606-.593-1.123-1.122-2.013-3.75-6.728-2.404-8.651.4-.573 1.417-1.162 3.97-.845Zm-3.094-10.838c3.741.082 6.7 1.482 8.795 4.161 1.607 2.054-.162 11.402-5.285 19.466l-.155-.196-.065-.081c1.324-2.187 1.065-4.351.834-6.269-.094-.787-.184-1.531-.16-2.23.023-.74.12-1.375.215-1.989.117-.757.235-1.539.202-2.462.025-.097.034-.212.022-.347-.084-.885-1.094-3.534-3.152-5.931-1.127-1.312-2.769-2.779-5.011-3.769.964-.2 2.283-.386 3.76-.353ZM34.28 150.689c-1.034 1.245-1.749 1.006-1.984.928-1.53-.511-3.307-3.748-4.873-8.881-1.355-4.441-2.147-8.907-2.21-10.16-.198-3.96.762-6.721 2.853-8.204 3.402-2.414 8.997-.969 11.245-.236-.033.032-.066.061-.098.094-3.69 3.727-3.602 10.094-3.593 10.483 0 .15.013.363.03.655.063 1.071.182 3.064-.134 5.321-.293 2.098.353 4.151 1.773 5.633.146.152.299.296.459.433a95.182 95.182 0 0 0-3.468 3.934Zm3.942-5.261c-1.144-1.195-1.664-2.857-1.426-4.56.333-2.384.21-4.461.144-5.576-.01-.156-.018-.293-.022-.401.539-.478 3.036-1.817 4.817-1.408.812.186 1.308.739 1.514 1.692 1.065 4.929.14 6.984-.602 8.635-.153.341-.298.662-.422.995l-.095.257c-.243.65-.468 1.255-.608 1.829-1.217-.004-2.4-.523-3.3-1.463Zm.187 6.648a2.86 2.86 0 0 1-.862-.371c.156-.073.435-.174.918-.273 2.339-.482 2.7-.822 3.489-1.824.18-.229.386-.49.67-.807.422-.474.616-.394.967-.248.284.118.56.474.673.866.053.185.113.537-.082.811-1.648 2.308-4.049 2.278-5.773 1.846Zm12.24 11.394c-2.862.614-3.875-.847-4.542-2.516-.431-1.078-.643-5.938-.493-11.306a.646.646 0 0 0-.028-.205 2.716 2.716 0 0 0-.08-.379c-.223-.781-.767-1.435-1.42-1.705-.26-.108-.736-.305-1.309-.159.122-.503.334-1.071.564-1.686l.096-.259c.108-.292.244-.594.388-.914.777-1.728 1.842-4.094.687-9.44-.433-2.002-1.878-2.98-4.07-2.753-1.313.136-2.514.667-3.114.971a10.31 10.31 0 0 0-.357.189c.167-2.017.8-5.787 3.164-8.173 1.488-1.501 3.47-2.243 5.886-2.203 4.76.078 7.811 2.521 9.534 4.557 1.484 1.755 2.287 3.522 2.608 4.475-2.412-.245-4.052.231-4.884 1.421-1.81 2.587.99 7.608 2.335 10.021.247.443.46.825.526.987.439 1.062 1.006 1.771 1.42 2.289.127.159.25.312.343.447-.73.21-2.042.697-1.923 3.131-.096 1.22-.782 6.937-1.13 8.956-.46 2.669-1.442 3.662-4.201 4.254Zm11.942-13.671c-.747.346-1.997.606-3.185.662-1.311.062-1.98-.147-2.136-.275-.074-1.516.49-1.675 1.087-1.842.094-.027.186-.052.274-.083.055.044.115.089.181.132 1.054.696 2.935.772 5.59.223l.028-.005c-.358.334-.97.784-1.839 1.188Z"
      />
    </g>
    <path
      fill="#fff"
      d="M83.57 196.954H6.5a5.5 5.5 0 0 0-5.5 5.5v77.07a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5v-77.07a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <path
      stroke="#AEAEC1"
      d="M83.57 196.954H6.5a5.5 5.5 0 0 0-5.5 5.5v77.07a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5v-77.07a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <path
      fill="url(#g)"
      fillRule="evenodd"
      d="M38.327 263.206v-17.944h-4.871v-7.581h4.725c0-.764.002-1.498.004-2.217.005-1.392.009-2.725-.004-4.097 0-5.97 4.542-7.702 8.626-7.702H53.693v7.489c-.395.002-1.566.002-2.64.001l-1.35-.001h-.023c-.288-.006-2.557-.053-2.557 2.224.015.963 0 4.281 0 4.281h6.596l-.534 7.459h-5.908v18.967c11.738-1.128 20.916-11.018 20.916-23.051 0-12.79-10.368-23.158-23.158-23.158-12.79 0-23.158 10.368-23.158 23.158 0 10.457 6.931 19.295 16.45 22.172Z"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      d="M83.57 294.93H6.5a5.5 5.5 0 0 0-5.5 5.5v77.07a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5v-77.07a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <path
      stroke="#AEAEC1"
      d="M83.57 294.93H6.5a5.5 5.5 0 0 0-5.5 5.5v77.07a5.5 5.5 0 0 0 5.5 5.5h77.07a5.5 5.5 0 0 0 5.5-5.5v-77.07a5.5 5.5 0 0 0-5.5-5.5Z"
    />
    <path
      fill="#707089"
      d="M20.151 336.616v-3.687h-3.687v-1.55h3.688v-3.67h1.55v3.67h3.669v1.55h-3.67v3.687h-1.55Zm10.687 0v-9.602h1.62v1.96l-.23-.303c.237-.605.617-1.069 1.14-1.389a3.301 3.301 0 0 1 1.763-.481c.748 0 1.419.208 2.013.623a3.157 3.157 0 0 1 1.247 1.639l-.463.018c.249-.748.67-1.312 1.264-1.692a3.512 3.512 0 0 1 1.978-.588c.665 0 1.264.154 1.799.463.546.309.98.736 1.3 1.282.321.547.481 1.164.481 1.853v6.217h-1.674v-5.682c0-.535-.095-.986-.285-1.354a2.105 2.105 0 0 0-.784-.855c-.32-.214-.7-.321-1.14-.321a2.15 2.15 0 0 0-1.158.321c-.333.202-.6.492-.802.873-.19.368-.285.813-.285 1.336v5.682h-1.674v-5.682c0-.535-.095-.986-.285-1.354a2.105 2.105 0 0 0-.784-.855c-.32-.214-.7-.321-1.14-.321a2.15 2.15 0 0 0-1.158.321c-.333.202-.6.492-.802.873-.19.368-.285.813-.285 1.336v5.682h-1.656Zm19.08.214c-.63 0-1.188-.113-1.675-.338a2.885 2.885 0 0 1-1.122-.962 2.539 2.539 0 0 1-.41-1.426c0-.51.107-.967.321-1.371.226-.416.57-.766 1.033-1.051.475-.285 1.07-.487 1.782-.606l3.562-.588v1.39l-3.188.534c-.618.107-1.07.303-1.354.588a1.46 1.46 0 0 0-.41 1.051c0 .392.155.718.463.98.321.261.719.392 1.194.392.605 0 1.128-.125 1.568-.374a2.799 2.799 0 0 0 1.05-1.051c.262-.44.392-.927.392-1.461v-2.441c0-.522-.196-.944-.587-1.264-.38-.333-.885-.499-1.515-.499-.546 0-1.033.142-1.46.427a2.478 2.478 0 0 0-.927 1.105l-1.443-.748c.178-.44.464-.832.855-1.176.392-.356.85-.636 1.372-.837a4.506 4.506 0 0 1 1.639-.303c.736 0 1.384.142 1.942.427.558.273.991.659 1.3 1.158.32.487.481 1.057.481 1.71v6.52h-1.62v-1.817l.302.107c-.202.38-.475.713-.82.998-.344.285-.748.51-1.21.677a4.458 4.458 0 0 1-1.515.249Zm7.432-.214v-9.602h1.62v1.871l-.266-.16a2.855 2.855 0 0 1 1.14-1.408c.534-.344 1.158-.516 1.87-.516.689 0 1.3.154 1.835.463a3.33 3.33 0 0 1 1.283 1.282c.32.547.48 1.164.48 1.853v6.217h-1.674v-5.682c0-.535-.095-.986-.285-1.354a2.034 2.034 0 0 0-.82-.855 2.215 2.215 0 0 0-1.193-.321c-.451 0-.855.107-1.211.321a2.152 2.152 0 0 0-.82.873c-.201.368-.302.813-.302 1.336v5.682H57.35Zm10.676 3.919c-.214 0-.428-.018-.641-.053a2.575 2.575 0 0 1-.606-.178v-1.479c.13.024.29.048.48.071.203.036.399.054.589.054.558 0 .98-.125 1.265-.374.296-.238.576-.653.837-1.247l.605-1.443-.035 1.443-4.097-10.315h1.799l3.189 8.195h-.535l3.171-8.195h1.835l-4.329 10.742a5.684 5.684 0 0 1-.784 1.39 3.454 3.454 0 0 1-1.14 1.015c-.451.25-.986.374-1.603.374Zm-43.573 14.081v-9.602h1.621v1.96l-.231-.303c.237-.605.617-1.069 1.14-1.389a3.301 3.301 0 0 1 1.763-.481c.748 0 1.42.208 2.013.623a3.157 3.157 0 0 1 1.247 1.639l-.463.018c.25-.748.671-1.312 1.265-1.692a3.512 3.512 0 0 1 1.977-.588c.665 0 1.265.154 1.8.463.546.309.98.736 1.3 1.282.32.547.48 1.164.48 1.853v6.217h-1.674v-5.682c0-.535-.095-.986-.285-1.354a2.105 2.105 0 0 0-.783-.855c-.321-.214-.701-.321-1.14-.321a2.15 2.15 0 0 0-1.158.321c-.333.202-.6.492-.802.873-.19.368-.285.813-.285 1.336v5.682h-1.675v-5.682c0-.535-.095-.986-.285-1.354a2.105 2.105 0 0 0-.784-.855c-.32-.214-.7-.321-1.14-.321a2.15 2.15 0 0 0-1.157.321c-.333.202-.6.492-.802.873-.19.368-.285.813-.285 1.336v5.682h-1.657Zm20.826.214c-.926 0-1.763-.214-2.512-.641a4.884 4.884 0 0 1-1.781-1.8c-.44-.76-.66-1.621-.66-2.583 0-.962.215-1.817.642-2.565a4.924 4.924 0 0 1 1.782-1.781c.748-.44 1.591-.659 2.53-.659.925 0 1.763.219 2.511.659a4.654 4.654 0 0 1 1.764 1.763c.439.749.659 1.61.659 2.583 0 .974-.226 1.841-.677 2.601a5.077 5.077 0 0 1-1.8 1.782c-.736.427-1.555.641-2.458.641Zm0-1.603c.594 0 1.128-.149 1.603-.446a3.075 3.075 0 0 0 1.14-1.229 3.582 3.582 0 0 0 .428-1.746c0-.653-.142-1.229-.428-1.728a3.112 3.112 0 0 0-1.14-1.211 2.876 2.876 0 0 0-1.603-.463c-.606 0-1.152.154-1.639.463a3.296 3.296 0 0 0-1.14 1.211c-.285.499-.427 1.075-.427 1.728 0 .642.142 1.224.427 1.746.285.523.665.932 1.14 1.229a3.085 3.085 0 0 0 1.64.446Zm7.095 1.389v-9.602h1.621v1.764l-.178-.249c.226-.547.57-.95 1.034-1.212.463-.273 1.027-.409 1.692-.409h.588v1.567h-.837c-.677 0-1.224.214-1.64.642-.415.415-.623 1.009-.623 1.781v5.718h-1.657Zm10.646.214c-.926 0-1.752-.22-2.476-.659a4.706 4.706 0 0 1-1.71-1.799c-.416-.772-.624-1.633-.624-2.583 0-.962.202-1.817.606-2.566a4.687 4.687 0 0 1 1.675-1.763 4.452 4.452 0 0 1 2.387-.659c.712 0 1.342.13 1.888.392a3.964 3.964 0 0 1 1.407 1.033c.392.427.69.92.891 1.478a4.66 4.66 0 0 1 .32 1.711c0 .13-.011.279-.035.445-.012.154-.03.303-.053.445h-7.874v-1.425h6.912l-.784.641c.107-.617.047-1.169-.178-1.656a2.69 2.69 0 0 0-2.494-1.586c-.558 0-1.07.143-1.532.428-.463.285-.826.695-1.087 1.229-.25.523-.35 1.146-.303 1.87-.047.701.06 1.319.32 1.853.274.523.654.932 1.141 1.229.499.285 1.04.428 1.621.428.641 0 1.182-.149 1.621-.446a3.49 3.49 0 0 0 1.069-1.14l1.39.713c-.19.439-.487.843-.891 1.211a4.482 4.482 0 0 1-1.408.855c-.534.214-1.134.321-1.799.321Z"
    />
    <g clipPath="url(#h)">
      <g strokeWidth={9} clipPath="url(#i)">
        <path stroke="#CAC7FF" d="M371.684 188.963h93.789" />
        <path stroke="url(#j)" strokeLinecap="round" d="m372 189 93.473-.037" />
      </g>
      <g filter="url(#k)">
        <path
          fill="#fff"
          d="M365.024 133h-95.048a7.976 7.976 0 0 0-7.976 7.976v95.048a7.976 7.976 0 0 0 7.976 7.976h95.048a7.976 7.976 0 0 0 7.976-7.976v-95.048a7.976 7.976 0 0 0-7.976-7.976Z"
        />
        <path
          stroke="#5F5CFF"
          strokeWidth={1.994}
          d="M365.024 133.997h-95.048a6.979 6.979 0 0 0-6.979 6.979v95.048a6.978 6.978 0 0 0 6.979 6.979h95.048a6.979 6.979 0 0 0 6.979-6.979v-95.048a6.98 6.98 0 0 0-6.979-6.979Z"
        />
        <mask
          id="l"
          width={65}
          height={67}
          x={285}
          y={155}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: 'luminance',
          }}
        >
          <path fill="#fff" d="M349.801 155.2h-64.602v66.6h64.602v-66.6Z" />
        </mask>
        <g mask="url(#l)">
          <path
            fill="#615EFF"
            fillRule="evenodd"
            d="M306.375 162.98c7.075-8.005 18.792-10.353 28.424-5.732 12.798 6.139 17.467 21.779 10.499 33.844l-15.675 27.11a6.604 6.604 0 0 1-9.015 2.416l18.977-32.828c5.055-8.756 1.674-20.105-7.604-24.574-6.962-3.353-15.473-1.678-20.615 4.088a17.561 17.561 0 0 0-.289 23.114 17.49 17.49 0 0 0 1.595 1.638l-11.078 19.199a6.601 6.601 0 0 1-9.014 2.416l12.027-20.843a24.036 24.036 0 0 1-3.657-8.238l-7.37 12.798a6.603 6.603 0 0 1-9.015 2.416l19.059-33.012a24.59 24.59 0 0 1 2.751-3.812Zm21.998 10.508c4.59 2.651 6.175 8.546 3.519 13.134l-18.276 31.576a6.609 6.609 0 0 1-9.015 2.416l16.97-29.397a9.615 9.615 0 1 1 6.802-17.729Zm-6.648 5.934a3.019 3.019 0 0 0-.557 4.228 3.017 3.017 0 0 0 4.66.153 3.022 3.022 0 0 0 .437-3.322 3.013 3.013 0 0 0-4.54-1.059Z"
            clipRule="evenodd"
          />
        </g>
      </g>
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={142.872}
        x2={171.761}
        y1={240.014}
        y2={172.286}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5F5CFF" />
        <stop offset={1} stopColor="#CAC7FF" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={162.97}
        x2={163.213}
        y1={27.051}
        y2={144.328}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5F5CFF" />
        <stop offset={1} stopColor="#CAC7FF" />
      </linearGradient>
      <linearGradient
        id="g"
        x1={45.035}
        x2={45.035}
        y1={217.876}
        y2={264.085}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#53ABF8" />
        <stop offset={1} stopColor="#2C67D9" />
      </linearGradient>
      <linearGradient
        id="j"
        x1="nan"
        x2="nan"
        y1="nan"
        y2="nan"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CAC7FF" />
        <stop offset={1} stopColor="#5F5CFF" />
      </linearGradient>
      <clipPath id="a">
        <path fill="#fff" d="M89 22h180v336H89z" />
      </clipPath>
      <clipPath id="h">
        <path fill="#fff" d="M197 92h241v241H197z" />
      </clipPath>
      <clipPath id="i">
        <path fill="#fff" d="M367 184h71v10h-71z" />
      </clipPath>
      <filter
        id="k"
        width={240.606}
        height={240.606}
        x={197.197}
        y={92.124}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={23.927} />
        <feGaussianBlur stdDeviation={32.402} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.792157 0 0 0 0 0.780392 0 0 0 0 1 0 0 0 0.75 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_34_283" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_34_283"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

import { Mail, Send } from 'lucide-react';

const PurpleContactForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      setMessage('');

      // Reset submission status after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100">
            Contact Us
          </h2>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 rounded-lg bg-purple-900/30 border border-purple-400/20"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <Mail className="w-10 h-10 text-purple-300" />
            </motion.div>
            <h3 className="text-xl font-semibold text-purple-100 mb-2">
              Message Sent!
            </h3>
            <p className="text-purple-300">We'll get back to you soon.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileFocus={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-300"
              >
                Email
              </label>
              <div className="relative">
                <motion.div
                  animate={{
                    x: [0, 2, -2, 0],
                    transition: { repeat: Infinity, duration: 2 },
                  }}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Mail className="h-5 w-5 text-purple-400" />
                </motion.div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-purple-900/30 border border-purple-400/20 rounded-lg text-purple-100 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileFocus={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label
                htmlFor="message"
                className="block text-sm font-medium text-purple-300"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="block w-full px-3 py-2 bg-purple-900/30 border border-purple-400/20 rounded-lg text-purple-100 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your message..."
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isSubmitting
                  ? 'bg-purple-800 text-purple-400'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40'
              }`}
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="block w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
};
