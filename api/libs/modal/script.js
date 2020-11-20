class Modal {
	
	constructor(options) {
		const { modalContainerId, modalTitleText, modalTitlePosition, modalContentsInnerHTML, modalCancelBtnText, modalSecondBtnText, modalSubmitBtnText, modalCancelBtnAction, modalSecondBtnAction, modalSubmitBtnAction, modalExtraContentsHTML } = options;
		
		this.$modaler = undefined;
		this.modalContainerId = modalContainerId;
		this.modalTitleText = modalTitleText || '';
		this.modalTitlePosition = modalTitlePosition || 'left';
		this.modalContentsInnerHTML = modalContentsInnerHTML;
		this.modalCancelBtnText = modalCancelBtnText || '';
		this.modalSecondBtnText = modalSecondBtnText || '';
		this.modalSubmitBtnText = modalSubmitBtnText || '';
		this.modalCancelBtnAction = modalCancelBtnAction || undefined;
		this.modalSecondBtnAction = modalSecondBtnAction || undefined;
		this.modalSubmitBtnAction = modalSubmitBtnAction || undefined;
		this.modalExtraContentsHTML = modalExtraContentsHTML || '';
		if(!this.modalContainerId) return;
		if(!this.modalContentsInnerHTML) return;
	}
	
	show() {
		if(!this.modalContentsInnerHTML) return;
		if(document.querySelector('.modal-container')) {
			document.querySelectorAll('.modal-container').forEach( m => {
				//remove all modals before show the modal 
				m.parentElement.removeChild(m);
			});
		}
		const self = this;
		//make trial modal
		this.$modaler = document.createElement('div');
		this.$modaler.id = this.modalContainerId;
		this.$modaler.className = 'modal-container';
		if(!this.modalContainerId) return;
		const $modalBackground = document.createElement('div');
		$modalBackground.className = 'modal-background';
		
		if(!!this.modalCancelBtnAction) {
			$modalBackground.onclick = this.modalCancelBtnAction;
		} else {
			$modalBackground.onclick = function(){
				self.destroy();
			};
		}

		this.$modaler.appendChild($modalBackground);
		
		const $modal = document.createElement('div');
		$modal.className = 'modal';
		
		if(this.modalTitleText) {
			const $modalTitle = document.createElement('div');
			$modalTitle.className = 'modal-title';
			const $modalTitleH = document.createElement('h1');
			$modalTitleH.innerText = this.modalTitleText;
			$modalTitle.appendChild($modalTitleH);
			$modal.appendChild($modalTitle); 
		}
		
		const $modalContentsContainer = document.createElement('div');
		$modalContentsContainer.className = 'modal-container';
		$modalContentsContainer.innerHTML = this.modalContentsInnerHTML;
		
		if(!!this.modalCancelBtnText || !!this.modalSecondBtnText || !!this.modalSubmitBtnText) {
			const $modalBtnsContainer = document.createElement('div');
			$modalBtnsContainer.className = 'buttons-container';
			if(!!this.modalCancelBtnText ) {
				const $modalCancelBtn = document.createElement('button');
				$modalCancelBtn.className = 'qoom-main-btn qoom-button-outline qoom-button-small';
				$modalCancelBtn.setAttribute('type', 'cancel');
			    $modalCancelBtn.innerText = this.modalCancelBtnText;
			    $modalCancelBtn.onclick = this.modalCancelBtnAction;
			    $modalBtnsContainer.appendChild($modalCancelBtn);
			}	
			if(!!this.modalSecondBtnText ) {
				const $modalSecondBtn = document.createElement('button');
				$modalSecondBtn.className = 'qoom-main-btn qoom-button-outline qoom-button-small';
				$modalSecondBtn.setAttribute('type', 'Second');
			    $modalSecondBtn.innerText = this.modalSecondBtnText;
			    $modalSecondBtn.onclick = this.modalSecondBtnAction;
			    $modalBtnsContainer.appendChild($modalSecondBtn);
			}	
			if(!!this.modalSubmitBtnText) {
				const $modalSubmitBtn = document.createElement('button');
				$modalSubmitBtn.className = 'qoom-main-btn qoom-button-full qoom-button-small';
				$modalSubmitBtn.id = 'submitBtn';
			    $modalSubmitBtn.setAttribute('type', 'submit');
			    $modalSubmitBtn.innerText = this.modalSubmitBtnText;
			    $modalSubmitBtn.onclick = this.modalSubmitBtnAction;
			    $modalBtnsContainer.appendChild($modalSubmitBtn);
			}
			$modalContentsContainer.appendChild($modalBtnsContainer);
		}
		
		if(!!this.modalExtraContentsHTML) {
			const $modalExtraContentsContainer = document.createElement('div');
			$modalExtraContentsContainer.className = 'extra-contents';
			$modalExtraContentsContainer.innerHTML = this.modalExtraContentsHTML;
			$modalContentsContainer.appendChild($modalExtraContentsContainer);
		}

		$modal.appendChild($modalContentsContainer);
		this.$modaler.appendChild($modal);
		document.body.appendChild(this.$modaler);
		if(!!this.modalSubmitBtnText && !this.modalSecondBtnText && !this.modalCancelBtnText) {
			document.querySelector(`#${this.modalContainerId} #submitBtn`).style.width = '100%';
			document.querySelector(`#${this.modalContainerId} #submitBtn`).style.marginLeft = '0';
		}
		
		const focusInput = $modal.querySelector('input[autofocus], textarea[autofocus]');
		if(focusInput) {
			function selectEndOfText() {
				try {
					if(focusInput.value) {
						focusInput.selectionStart = focusInput.selectionEnd = focusInput.value.length;
					}
					focusInput.removeEventListener('focus', selectEndOfText);
				} catch(e) {}
			}
			focusInput.addEventListener('focus', selectEndOfText);
			focusInput.focus();
		}
	}
	
	destroy(){
		document.body.removeChild(this.$modaler);
		delete this.$modaler;
	}
}    

export default Modal