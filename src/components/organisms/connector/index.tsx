'use client';
{
  /* Destination hover animations */
}
import React, { useState } from 'react';

const ConnectionOnboardingAnimation = () => {
  const [hoveredSource, setHoveredSource] = useState(null);
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const sources = [
    {
      id: 'facebook',
      name: 'Facebook Marketing',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDEyQzI0IDE4LjYyNzQgMTguNjI3NCAyNCAxMiAyNEM1LjM3MjU4IDI0IDAgMTguNjI3NCAwIDEyQzAgNS4zNzI1OCA1LjM3MjU4IDAgMTIgMEMxOC42Mjc0IDAgMjQgNS4zNzI1OCAyNCAxMloiIGZpbGw9IiMxODc3RjIiLz4KPHBhdGggZD0iTTE2LjY3MSAxNS4xNTI5TDE3LjIwNzggMTEuODM0MkgxMy45MDQyVjkuNzY4MzFDMTMuOTA0MiA4LjAzNzY5IDE0LjM5MzkgNi4zNDExNiAxNi40NDc2IDYuMzQxMTZIMTcuNDA1NFY0LjI5MDkxQzE2LjQzMzMgNC4xNTg3NCAxNS40NTkzIDQuMDk0NzQgMTQuNDg0MyA0LjA5OTA5QzEwLjc3NzEgNC4wOTkwOSA5LjYwMDkzIDUuNjg4MzYgOS42MDA5MyAxMC44NzlWMTEuODM0Mkg2Ljc0MjE5VjE1LjE1MjlIOS42MDA5M1YyMy45OTU5QzEwLjA2OTcgMjQuMDcxMSAxMC41NDI5IDI0LjEwOTggMTEuMDE3OSAyNC4xMDkzQzExLjYyNTQgMjQuMTA4OSAxMi4yMzEyIDI0LjA1OTYgMTIuODMwMSAyMy45NjI0VjE1LjE1MjlIMTYuNjcxWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
      testId: 'onboardingSource-0',
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjUzMTIgMTEuNTkzOEMxOS4xODc1IDExLjU5MzggMTguODQzOCAxMS43MTg4IDE4LjU5MzggMTEuOTA2MkMxOC41IDExLjk2ODggMTguNDY4OCAxMi4wNjI1IDE4LjQwNjIgMTIuMTI1QzE4LjM3NSAxMi4xNTYyIDE4LjM3NSAxMi4yMTg4IDE4LjM0MzggMTIuMjVDMTguMjE4OCAxMi4zMTI1IDE4LjEyNSAxMi40Mzc1IDE4LjA2MjUgMTIuNTYyNUMxNy45Njg4IDEyLjc1IDE3LjkwNjIgMTMgMTcuOTA2MiAxMy4yNUMxNy45MDYyIDEzLjY4NzUgMTguMDYyNSAxNC4wOTM4IDE4LjM0MzggMTQuNDA2MkMxOC42MjUgMTQuNzE4OCAxOS4wMzEyIDE0Ljg3NSAxOS40Njg4IDE0Ljg3NUMxOS45MDYyIDE0Ljg3NSAyMC4zMTI1IDE0LjcxODggMjAuNTkzOCAxNC40MDYyQzIwLjg3NSAxNC4wOTM4IDIxLjAzMTIgMTMuNjg3NSAyMS4wMzEyIDEzLjI1QzIxLjAzMTIgMTIuODEyNSAyMC44NzUgMTIuNDA2MiAyMC41OTM4IDEyLjA5MzhDMjAuMzEyNSAxMS43ODEyIDE5LjkwNjIgMTEuNjI1IDE5LjQ2ODggMTEuNjI1SDE5LjUzMTJWMTEuNTkzOFoiIGZpbGw9IiMzMzY3OTEiLz4KPHBhdGggZD0iTTEyIDJDNy44NTc4NiAyIDQuNSA1LjE1MzA2IDQuNSA5QzQuNSAxMS4xNDI5IDUuMzc3NTUgMTMuMDkxOCA2Ljc3NTUxIDE0LjQ4OThDOC4xNzM0NyAxNS44ODc4IDEwLjE0MjkgMTYuNSAxMiAxNi41QzEzLjg1NzEgMTYuNSAxNS44MjY1IDE1Ljg4NzggMTcuMjI0NSAxNC40ODk4QzE4LjYyMjQgMTMuMDkxOCAxOS41IDExLjE0MjkgMTkuNSA5QzE5LjUgNS4xNTMwNiAxNi4xNDIxIDIgMTIgMloiIGZpbGw9IiM0Njc5QTQiLz4KPC9zdmc+',
      testId: 'onboardingSource-1',
    },
    {
      id: 'csv',
      name: 'CSV Files',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMTRINlYxMkg3VjE0Wk05IDE0SDhWMTJIOVYxNFpNMTEgMTRIMTBWMTJIMTFWMTRaTTEzIDE0SDEyVjEySDE0VjE0SDE0SDEzWk0xNSAxNEgxNFYxMkgxNlYxNEgxNlYxNEgxNVpNMTcgMTRIMTZWMTJIMThWMTRIMThWMTRIMTdaTTE5IDE0SDE4VjEySDE5VjE0WiIgZmlsbD0iIzIwN0E0NSIvPgo8cGF0aCBkPSJNNyAxNkg2VjE0SDdWMTZaTTkgMTZIOFYxNEg5VjE2Wk0xMSAxNkgxMFYxNEgxMVYxNlpNMTMgMTZIMTJWMTRIMTRWMTZIMTRIMTNaTTE1IDE2SDE0VjE0SDE2VjE2SDE2VjE2SDE1Wk0xNyAxNkgxNlYxNEgxOFYxNkgxOFYxNkgxN1pNMTkgMTZIMThWMTRIMTlWMTZaIiBmaWxsPSIjMjA3QTQ1Ii8+CjxwYXRoIGQ9Ik03IDE4SDZWMTZIN1YxOFpNOSAxOEg4VjE2SDlWMThaTTExIDE4SDEwVjE2SDExVjE4Wk0xMyAxOEgxMlYxNkgxNFYxOEgxNEgxM1pNMTUgMThIMTRWMTZIMTZWMThIMTZWMThIMTVaTTE3IDE4SDE2VjE2SDE4VjE4SDE4VjE4SDE3Wk0xOSAxOEgxOFYxNkgxOVYxOFoiIGZpbGw9IiMyMDdBNDUiLz4KPHBhdGggZD0iTTUgMTBDNSA5LjQ0NzcyIDUuNDQ3NzIgOSA2IDlIMThDMTguNTUyMyA5IDE5IDkuNDQ3NzIgMTkgMTBWMjBDMTkgMjAuNTUyMyAxOC41NTIzIDIxIDE4IDIxSDZDNS40NDc3MiAyMSA1IDIwLjU1MjMgNSAyMFYxMFoiIGZpbGw9IiMxMzc0NGYiLz4KPC9zdmc+',
      testId: 'onboardingSource-2',
    },
  ];

  const destinations = [
    {
      id: 'bigquery',
      name: 'BigQuery',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMjMgNC42OEwxNS42OCA0LjY4SDE0TDE2IDE3LjVIOEwxMCA0LjY4SDguMzJMMTIgMloiIGZpbGw9IiNEQjQ0MzciLz4KPHBhdGggZD0iTTEyIDJMMTAuNzcgNC42OEw4LjMyIDQuNjhIMTBMOCAxNy41SDE2TDE0IDQuNjhIMTUuNjhMMTIgMloiIGZpbGw9IiNGMzkxNjMiLz4KPHBhdGggZD0iTTEyIDExLjVMMTQuNDggMTMuMjZMMTYgMTcuNUg4TDkuNTIgMTMuMjZMMTIgMTEuNVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTEyIDExLjVMMTcuNSAxNi41SDE2TDE0LjQ4IDEzLjI2TDEyIDExLjVaIiBmaWxsPSIjNjY5REY2Ii8+CjxwYXRoIGQ9Ik0xMiAxMS41TDYuNSAxNi41SDhMOS41MiAxMy4yNkwxMiAxMS41WiIgZmlsbD0iIzY2OURGNiIvPgo8L3N2Zz4=',
      testId: 'onboardingDestination-0',
    },
    {
      id: 'postgres-dest',
      name: 'PostgreSQL',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjUzMTIgMTEuNTkzOEMxOS4xODc1IDExLjU5MzggMTguODQzOCAxMS43MTg4IDE4LjU5MzggMTEuOTA2MkMxOC41IDExLjk2ODggMTguNDY4OCAxMi4wNjI1IDE4LjQwNjIgMTIuMTI1QzE4LjM3NSAxMi4xNTYyIDE4LjM3NSAxMi4yMTg4IDE4LjM0MzggMTIuMjVDMTguMjE4OCAxMi4zMTI1IDE4LjEyNSAxMi40Mzc1IDE4LjA2MjUgMTIuNTYyNUMxNy45Njg4IDEyLjc1IDE3LjkwNjIgMTMgMTcuOTA2MiAxMy4yNUMxNy45MDYyIDEzLjY4NzUgMTguMDYyNSAxNC4wOTM4IDE4LjM0MzggMTQuNDA2MkMxOC42MjUgMTQuNzE4OCAxOS4wMzEyIDE0Ljg3NSAxOS40Njg4IDE0Ljg3NUMxOS45MDYyIDE0Ljg3NSAyMC4zMTI1IDE0LjcxODggMjAuNTkzOCAxNC40MDYyQzIwLjg3NSAxNC4wOTM4IDIxLjAzMTIgMTMuNjg3NSAyMS4wMzEyIDEzLjI1QzIxLjAzMTIgMTIuODEyNSAyMC44NzUgMTIuNDA2MiAyMC41OTM4IDEyLjA5MzhDMjAuMzEyNSAxMS43ODEyIDE5LjkwNjIgMTEuNjI1IDE5LjQ2ODggMTEuNjI1SDE5LjUzMTJWMTEuNTkzOFoiIGZpbGw9IiMzMzY3OTEiLz4KPHBhdGggZD0iTTEyIDJDNy44NTc4NiAyIDQuNSA1LjE1MzA2IDQuNSA5QzQuNSAxMS4xNDI5IDUuMzc3NTUgMTMuMDkxOCA2Ljc3NTUxIDE0LjQ4OThDOC4xNzM0NyAxNS44ODc4IDEwLjE0MjkgMTYuNSAxMiAxNi41QzEzLjg1NzEgMTYuNSAxNS44MjY1IDE1Ljg4NzggMTcuMjI0NSAxNC40ODk4QzE4LjYyMjQgMTMuMDkxOCAxOS41IDExLjE0MjkgMTkuNSA5QzE5LjUgNS4xNTMwNiAxNi4xNDIxIDIgMTIgMloiIGZpbGw9IiM0Njc5QTQiLz4KPC9zdmc+',
      testId: 'onboardingDestination-1',
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuNSA0LjVMMTYgM0wxNS41IDUuNUwxOCA2TDE1LjUgNy41TDE2IDEwTDEzLjUgOC41TDEyIDExTDEwLjUgOC41TDggMTBMOC41IDcuNUw2IDZMOC41IDUuNUw4IDNMMTAuNSA0LjVMMTIgMloiIGZpbGw9IiMyOUM1RjYiLz4KPHBhdGggZD0iTTEyIDEyTDE0IDEwTDE2IDEyTDE0IDE0TDE2IDE2TDE0IDE0TDEyIDE2TDEwIDE0TDggMTZMMTAgMTRMOCAxMkwxMCAxNEwxMiAxMlpNMTIgMjJMMTMuNSAxOS41TDE2IDIxTDE1LjUgMTguNUwxOCAxOEwxNS41IDE2LjVMMTYgMTRMMTMuNSAxNS41TDEyIDEzTDEwLjUgMTUuNUw4IDE0TDguNSAxNi41TDYgMThMOC41IDE4LjVMOCAyMUwxMC41IDE5LjVMMTIgMjJaIiBmaWxsPSIjMjlDNUY2Ii8+Cjwvc3ZnPg==',
      testId: 'onboardingDestination-2',
    },
  ];

  const QuestionIcon = () => (
    <svg
      fill="none"
      role="img"
      viewBox="0 0 24 24"
      className="w-4 h-4 text-blue-900"
    >
      <path
        fill="currentColor"
        d="M11.29 15.29a2 2 0 0 0-.12.15.8.8 0 0 0-.09.18.6.6 0 0 0-.06.18 1.4 1.4 0 0 0 0 .2.84.84 0 0 0 .08.38.9.9 0 0 0 .54.54.94.94 0 0 0 .76 0 .9.9 0 0 0 .54-.54A1 1 0 0 0 13 16a1 1 0 0 0-1.71-.71M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20m0-13a3 3 0 0 0-2.6 1.5 1 1 0 1 0 1.73 1A1 1 0 0 1 12 9a1 1 0 1 1 0 2 1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-.18A3 3 0 0 0 12 7"
      ></path>
    </svg>
  );

  const PlusIcon = () => (
    <svg
      fill="none"
      role="img"
      viewBox="0 0 24 24"
      className="w-6 h-6 text-blue-900"
    >
      <path
        fill="currentColor"
        d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2"
      ></path>
    </svg>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white">
      <div className="relative">
        {/* Sources Section */}
        <div className="absolute left-0 top-0">
          <div className="-mb-6"></div>
          <div className="flex flex-col gap-8">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              Sources
              <QuestionIcon />
            </h3>
            {sources.map((source, index) => (
              <div
                key={source.id}
                data-testid={source.testId}
                className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:shadow-purple-400/50 transition-all duration-300 cursor-pointer border border-gray-200 transform hover:scale-105"
                title={`Connect to ${source.name}`}
                onMouseEnter={() => setHoveredSource(index)}
                onMouseLeave={() => setHoveredSource(null)}
                style={{
                  boxShadow:
                    hoveredSource === index
                      ? '0 10px 25px -3px rgba(168, 85, 247, 0.4), 0 4px 6px -2px rgba(168, 85, 247, 0.05)'
                      : '0 10px 15px -3px rgba(168, 85, 247, 0.2), 0 4px 6px -2px rgba(168, 85, 247, 0.05)',
                }}
              >
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <img
                    src={source.icon}
                    alt={source.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
            <div
              className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:shadow-purple-400/50 transition-all duration-300 cursor-pointer border border-gray-200 transform hover:scale-105"
              style={{
                boxShadow:
                  '0 10px 15px -3px rgba(168, 85, 247, 0.2), 0 4px 6px -2px rgba(168, 85, 247, 0.05)',
              }}
            >
              <PlusIcon />
            </div>
          </div>
        </div>

        {/* Central SVG Animation */}
        <div className="flex justify-center">
          <svg
            width="492"
            height="318"
            viewBox="0 0 492 318"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            <defs>
              <linearGradient
                id="highlightedSource"
                x1="490"
                y1="25"
                x2="5.00002"
                y2="115"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FB7C37" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient
                id="highlightedDestination"
                x1="492"
                y1="25"
                x2="-2"
                y2="115"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9333EA" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
              <linearGradient
                id="defaultDestination"
                x1="492"
                y1="25"
                x2="-2"
                y2="115"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#A78BFA" />
              </linearGradient>
              <filter
                id="backgroundGradient"
                x="101"
                y="0"
                width="297"
                height="318"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="10"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_dropShadow_3082_52204"
                />
                <feOffset dy="13" />
                <feGaussianBlur stdDeviation="9" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.101961 0 0 0 0 0.0980392 0 0 0 0 0.301961 0 0 0 0.17 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3082_52204"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="23" dy="-27" />
                <feGaussianBlur stdDeviation="30.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.984314 0 0 0 0 0.223529 0 0 0 0 0.372549 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_dropShadow_3082_52204"
                  result="effect2_dropShadow_3082_52204"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-20" dy="2" />
                <feGaussianBlur stdDeviation="29" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.262745 0 0 0 0 0.231373 0 0 0 0 0.984314 0 0 0 0.3 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect2_dropShadow_3082_52204"
                  result="effect3_dropShadow_3082_52204"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="12" dy="23" />
                <feGaussianBlur stdDeviation="36.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.404861 0 0 0 0 0.854625 0 0 0 0 0.883333 0 0 0 0.41 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect3_dropShadow_3082_52204"
                  result="effect4_dropShadow_3082_52204"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect4_dropShadow_3082_52204"
                  result="shape"
                />
              </filter>
            </defs>

            {/* Static paths */}
            <path
              id="sourcePath0"
              d="M0 25H16.3176C38.7973 25 58.5134 40.0021 64.5074 61.668L80.4605 119.332C86.4545 140.998 106.171 156 128.65 156H179"
              strokeLinejoin="round"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              opacity="0.2"
            />
            <path
              id="sourcePath2"
              d="M0 202H30.1023C45.422 202 59.8962 194.977 69.3771 182.943L75.5908 175.057C85.0717 163.023 99.5459 156 114.866 156H179"
              strokeLinejoin="round"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              opacity="0.2"
            />
            <path
              id="sourcePath3"
              d="M0 288H16.2406C38.7565 288 58.495 272.95 64.4563 251.238L80.5116 192.762C86.4729 171.049 106.211 156 128.727 156H179"
              strokeLinejoin="round"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              opacity="0.2"
            />

            <path
              id="destinationPath0"
              d="M492 25H475.682C453.203 25 433.487 40.0021 427.493 61.668L411.539 119.332C405.545 140.998 385.829 156 363.35 156H313"
              strokeLinejoin="round"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              opacity="0.2"
            />
            <path
              id="destinationPath1"
              d="M492 115H460.173C445.843 115 432.202 121.149 422.711 131.885L416.321 139.115C406.83 149.851 393.189 156 378.859 156H313"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              opacity="0.2"
              strokeLinejoin="round"
            />
            <path
              id="destinationPath3"
              d="M492 288H475.759C453.243 288 433.505 272.95 427.544 251.238L411.488 192.762C405.527 171.049 385.789 156 363.273 156H313"
              strokeLinejoin="round"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              opacity="0.2"
            />

            {/* Default animation paths when nothing is hovered */}
            {hoveredSource === null && hoveredDestination === null && (
              <>
                <path
                  id="defaultSourcePath"
                  d="M0 115H31.8265C46.1566 115 59.798 121.149 69.2887 131.885L75.6792 139.115C85.1699 149.851 98.8113 156 113.141 156H179"
                  strokeLinejoin="round"
                  stroke="url(#highlightedSource)"
                  strokeWidth="5"
                />
                <path
                  id="defaultDestinationPath"
                  d="M492 25H475.682C453.203 25 433.487 40.0021 427.493 61.668L411.539 119.332C405.545 140.998 385.829 156 363.35 156H313"
                  strokeLinejoin="round"
                  stroke="url(#defaultDestination)"
                  strokeWidth="5"
                />
              </>
            )}

            {/* Highlighted paths - dynamically change based on hover */}
            <path
              id="sourcePath1"
              d="M0 115H31.8265C46.1566 115 59.798 121.149 69.2887 131.885L75.6792 139.115C85.1699 149.851 98.8113 156 113.141 156H179"
              strokeLinejoin="round"
              stroke={
                hoveredSource === 1 ? 'url(#highlightedSource)' : '#1e3a8a'
              }
              strokeWidth={hoveredSource === 1 ? '5' : '1.5'}
              strokeDasharray={hoveredSource === 1 ? 'none' : '3 6'}
              opacity={hoveredSource === 1 ? '1' : '0.2'}
            />
            <path
              id="sourcePath0Active"
              d="M0 25H16.3176C38.7973 25 58.5134 40.0021 64.5074 61.668L80.4605 119.332C86.4545 140.998 106.171 156 128.65 156H179"
              strokeLinejoin="round"
              stroke={
                hoveredSource === 0 ? 'url(#highlightedSource)' : '#1e3a8a'
              }
              strokeWidth={hoveredSource === 0 ? '5' : '1.5'}
              strokeDasharray={hoveredSource === 0 ? 'none' : '3 6'}
              opacity={hoveredSource === 0 ? '1' : '0.2'}
            />
            <path
              id="sourcePath2Active"
              d="M0 202H30.1023C45.422 202 59.8962 194.977 69.3771 182.943L75.5908 175.057C85.0717 163.023 99.5459 156 114.866 156H179"
              strokeLinejoin="round"
              stroke={
                hoveredSource === 2 ? 'url(#highlightedSource)' : '#1e3a8a'
              }
              strokeWidth={hoveredSource === 2 ? '5' : '1.5'}
              strokeDasharray={hoveredSource === 2 ? 'none' : '3 6'}
              opacity={hoveredSource === 2 ? '1' : '0.2'}
            />

            <path
              id="destinationPath0Active"
              d="M492 25H475.682C453.203 25 433.487 40.0021 427.493 61.668L411.539 119.332C405.545 140.998 385.829 156 363.35 156H313"
              strokeLinejoin="round"
              stroke={
                hoveredDestination === 0
                  ? 'url(#highlightedDestination)'
                  : '#1e3a8a'
              }
              strokeWidth={hoveredDestination === 0 ? '5' : '1.5'}
              strokeDasharray={hoveredDestination === 0 ? 'none' : '3 6'}
              opacity={hoveredDestination === 0 ? '1' : '0.2'}
            />
            <path
              id="destinationPath1Active"
              d="M492 115H460.173C445.843 115 432.202 121.149 422.711 131.885L416.321 139.115C406.83 149.851 393.189 156 378.859 156H313"
              strokeLinejoin="round"
              stroke={
                hoveredDestination === 1
                  ? 'url(#highlightedDestination)'
                  : '#1e3a8a'
              }
              strokeWidth={hoveredDestination === 1 ? '5' : '1.5'}
              strokeDasharray={hoveredDestination === 1 ? 'none' : '3 6'}
              opacity={hoveredDestination === 1 ? '1' : '0.2'}
            />
            <path
              id="destinationPath2Active"
              d="M492 202H461.898C446.578 202 432.104 194.977 422.623 182.943L416.409 175.057C406.928 163.023 392.454 156 377.134 156H313"
              strokeLinejoin="round"
              stroke={
                hoveredDestination === 2
                  ? 'url(#highlightedDestination)'
                  : '#1e3a8a'
              }
              strokeWidth={hoveredDestination === 2 ? '5' : '1.5'}
              strokeDasharray={hoveredDestination === 2 ? 'none' : '3 6'}
              opacity={hoveredDestination === 2 ? '1' : '0.2'}
            />

            {/* Central hub */}
            <g filter="url(#backgroundGradient)">
              <rect
                x="179"
                y="88"
                width="134"
                height="134"
                rx="48"
                fill="#1e40af"
              />
              <text
                x="246"
                y="140"
                textAnchor="middle"
                className="fill-white text-xl font-bold"
              >
                DATA
              </text>
              <text
                x="246"
                y="165"
                textAnchor="middle"
                className="fill-white text-xl font-bold"
              >
                TRAM
              </text>
              <circle cx="230" cy="180" r="8" fill="#3b82f6" />
              <circle cx="246" cy="185" r="6" fill="#60a5fa" />
              <circle cx="262" cy="180" r="8" fill="#3b82f6" />
            </g>

            {/* Animated circles - show based on hover state or default */}
            {/* Default animation when nothing is hovered */}
            {hoveredSource === null && hoveredDestination === null && (
              <>
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath xlinkHref="#defaultSourcePath" />
                  </animateMotion>
                </circle>
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#8B5CF6"
                  stroke="white"
                  strokeWidth="2"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    rotate="auto"
                    keyPoints="1;0"
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath xlinkHref="#defaultDestinationPath" />
                  </animateMotion>
                </circle>
              </>
            )}

            {/* Source hover animations */}
            {hoveredSource === 0 && (
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              >
                <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                  <mpath xlinkHref="#sourcePath0Active" />
                </animateMotion>
              </circle>
            )}
            {hoveredSource === 1 && (
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              >
                <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                  <mpath xlinkHref="#sourcePath1" />
                </animateMotion>
              </circle>
            )}
            {hoveredSource === 2 && (
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              >
                <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                  <mpath xlinkHref="#sourcePath2Active" />
                </animateMotion>
              </circle>
            )}

            {hoveredDestination === 0 && (
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#9333EA"
                stroke="white"
                strokeWidth="2"
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints="1;0"
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath xlinkHref="#destinationPath0Active" />
                </animateMotion>
              </circle>
            )}
            {hoveredDestination === 1 && (
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#9333EA"
                stroke="white"
                strokeWidth="2"
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints="1;0"
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath xlinkHref="#destinationPath1Active" />
                </animateMotion>
              </circle>
            )}
            {hoveredDestination === 2 && (
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#9333EA"
                stroke="white"
                strokeWidth="2"
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints="1;0"
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath xlinkHref="#destinationPath2Active" />
                </animateMotion>
              </circle>
            )}
          </svg>
        </div>

        {/* Destinations Section */}
        <div className="absolute right-0 top-0">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              Destinations
              <QuestionIcon />
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                data-testid={destination.testId}
                className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:shadow-purple-400/50 transition-all duration-300 cursor-pointer border border-gray-200 transform hover:scale-105"
                title={`Connect to ${destination.name}`}
                onMouseEnter={() => setHoveredDestination(index)}
                onMouseLeave={() => setHoveredDestination(null)}
                style={{
                  boxShadow:
                    hoveredDestination === index
                      ? '0 10px 25px -3px rgba(168, 85, 247, 0.4), 0 4px 6px -2px rgba(168, 85, 247, 0.05)'
                      : '0 10px 15px -3px rgba(168, 85, 247, 0.2), 0 4px 6px -2px rgba(168, 85, 247, 0.05)',
                }}
              >
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <img
                    src={destination.icon}
                    alt={destination.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
            <div
              className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:shadow-purple-400/50 transition-all duration-300 cursor-pointer border border-gray-200 transform hover:scale-105"
              style={{
                boxShadow:
                  '0 10px 15px -3px rgba(168, 85, 247, 0.2), 0 4px 6px -2px rgba(168, 85, 247, 0.05)',
              }}
            >
              <PlusIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionOnboardingAnimation;
