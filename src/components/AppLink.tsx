import { Link, type LinkProps } from '@mui/material'

export default function AppLink(props: React.PropsWithChildren<LinkProps>) {
  return (
    <Link
      style={{
        textDecorationColor: 'gray',
      }}
      {...props}
    >
      {props.children}
    </Link>
  )
}
