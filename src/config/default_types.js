const canal = [
    {'intitule': 'app_client','description': `Application satélite de fonds commun de placement de BNI Gestion`,'pass': 'rdt!8vz5'}, 
    {'intitule': 'app_backoffice','description': `Application d'administration de BNI Gestion`,'pass': 'Gs)65dx$'}, 
]

const type_acteur = [
    {'intitule': 'agent','description': 'Modérateur BNI Gestion'},
    {'intitule': 'particulier','description': 'Acteur client de type particulier'},
    {'intitule': 'entreprise','description': 'Acteur client de type entreprise'},
]

const type_document = [
    {'intitule': 'photoprofil','description': 'Photo de profil de l\'acteur','format': 'PNG,JPEG,JPG'}, 
    {'intitule': 'signature','description': 'Document graphologique demandé à la création de compte client','format': 'PNG,JPEG,JPG,PDF'},
    {'intitule': 'domiciliation','description': 'Document justificatif (facture d\'eau, d\'électricité, attestation de residence)','format': 'PNG,JPEG,JPG,PDF'}, 
    {'intitule': 'kyc','description': 'Document d\'information KYC','format': 'PNG,JPEG,JPG,PDF'}, 
    {'intitule': 'prospectus','description': `Document d'information`,'format': 'PNG,JPEG,JPG,PDF'}, 
    {'intitule': 'brochure','description': `Document d'information`,'format': 'PNG,JPEG,JPG,PDF'}, 
    {'intitule': 'dici','description': `Document d'information`,'format': 'PNG,JPEG,JPG,PDF'}, 
    {'intitule': 'factsheet','description': `Document d'information`,'format': 'PNG,JPEG,JPG,PDF'}, 
    {'intitule': 'reclamation','description': `Document associé à une réclamation`,'format': 'PNG,JPEG,JPG,PDF'},
]

const type_operation = [
    {'intitule': 'configuration','description': 'Opération liées à la configuration de ressources systèmes','transaction': false}, 
    {'intitule': 'ressources','description': 'Opération liées au chargement de ressources fonctionnelles','transaction': false}, 
    {'intitule': 'onbording','description': 'Opération liées à la création de compte utilisateur','transaction': false}, 
    {'intitule': 'connexion','description': 'Opération liées à la gestion de session','transaction': false}, 
    {'intitule': 'administration','description': 'Opération liées à l\'administration','transaction': false}, 
    {'intitule': 'depot','description': 'Opération pour approvisionner le compte du client','transaction': true},
    {'intitule': 'souscription','description': 'Opération pour toute action de souscription','transaction': true}, 
    {'intitule': 'rachat','description': 'Opération pour toute action de rachat','transaction': true}, 
    {'intitule': 'transfert','description': 'Opération pour effectuer un cashout','transaction': true},
]

const profil = [
    {'intitule': 'admin','description': 'Administrateur BNI Gestion', 'habilitations': 'Total'},
]

module.exports = {
    canal,
    type_acteur,
    type_document,
    type_operation,
    profil
}