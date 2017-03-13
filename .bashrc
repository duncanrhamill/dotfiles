#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

. /usr/lib/python3.6/site-packages/powerline/bindings/bash/powerline.sh

alias ls='ls --color=auto'
PS1='[\u@\h \W]\$ '

function mkandcd() {
	mkdir $1 && cd $1
}

alias spacs='sudo pacman -S'
alias update-spacs='sudo pacman -Syu'

alias mkcd=mkandcd

alias update-clock='sudo hwclock -s'

export PATH="$HOME/opt/cross/bin:$PATH"

alias cross-gcc='$HOME/opt/cross/bin/i686-elf-gcc'
alias cross-as='$HOME/opt/cross/bin/i686-elf-as'

eval $(thefuck --alias)
