sp="/-\|"
sc=0
spin() {
   printf '\b%.1s' "$sp"
   sp=${sp#?}${sp%???}
}
endspin() {
   printf "\r%s\n" "$@"
}

until false; do
   spin
   sleep .1
done
endspin
