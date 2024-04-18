export const PlusIcon = ({ color }: { color?: string }) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <circle
          cx="7"
          cy="7"
          r="6"
          transform="rotate(90 7 7)"
          fill="white"
          stroke={color || '#F26060'}
        />
        <path
          d="M7.01758 4L7.01758 10"
          stroke={color || '#F26060'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 7L4 7" stroke={color || '#F26060'} strokeLinecap="round" />
      </svg>
    </div>
  )
}

export const MinusIcon = ({ color }: { color?: string }) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
      >
        <circle
          cx="6.5"
          cy="7"
          r="6"
          fill="white"
          stroke={color || '#F26060'}
        />
        <path
          d="M3.40332 7.13629L9.98305 7.13629"
          stroke={color || '#F26060'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
