/*
 * MIT License
 *
 *  Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
'use strict';


var assert = function(a,b) {
    if (a == b) {
        return true
    } else {
        throw "Error: Generated output does not correspond to the expected"
    }
}


const preserveCamelCase = string => {
    let isLastCharLower = false;
    let isLastCharUpper = false;
    let isLastLastCharUpper = false;

    for (let i = 0; i < string.length; i++) {
        const character = string[i];

        if (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {
            string = string.slice(0, i) + '-' + string.slice(i);
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i++;
        } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {
            string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
        } else {
            isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
        }
    }

    return string;
};

const camelCase = (input, options) => {
    if (!(typeof input === 'string' || Array.isArray(input))) {
        throw new TypeError('Expected the input to be `string | string[]`');
    }

    options = Object.assign({
        pascalCase: false
    }, options);

    const postProcess = x => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

    if (Array.isArray(input)) {
        input = input.map(x => x.trim())
            .filter(x => x.length)
            .join('-');
    } else {
        input = input.trim();
    }

    if (input.length === 0) {
        return '';
    }

    if (input.length === 1) {
        return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
    }

    const hasUpperCase = input !== input.toLowerCase();

    if (hasUpperCase) {
        input = preserveCamelCase(input);
    }

    input = input
        .replace(/^[_.\- ]+/, '')
        .toLowerCase()
        .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
        .replace(/\d+(\w|$)/g, m => m.toUpperCase());

    return postProcess(input);
};

const original_space_string = "Ignorant saw her her drawings marriage laughter. Case oh an that or away sigh \
do here upon. Acuteness you exquisite ourselves now end forfeited. Enquire ye without it garrets up himself. \
Interest our nor received followed was. Cultivated an up solicitude mr unpleasant. Wrote water woman of heart \
it total other. By in entirely securing suitable graceful at families improved. Zealously few furniture repulsive \
was agreeable consisted difficult. Collected breakfast estimable questions in to favourite it. Known he place \
worth words it as to. Spoke now noise off smart her ready. Improve him believe opinion offered met and end cheered \
forbade. Friendly as stronger speedily by recurred. Son interest wandered sir addition end say. Manners beloved \
affixed picture men ask. Explain few led parties attacks picture company. On sure fine kept walk am in it. Resolved \
to in believed desirous unpacked weddings together. Nor off for enjoyed cousins herself. Little our played lively \
she adieus far sussex. Do theirs others merely at temper it nearer. Assure polite his really and others figure though. \
Day age advantages end sufficient eat expression travelling. Of on am father by agreed supply rather either. Own \
handsome delicate its property mistress her end appetite. Mean are sons too sold nor said. Son share three men power \
boy you. Now merits wonder effect garret own. She who arrival end how fertile enabled. Brother she add yet see minuter \
natural smiling article painted. Themselves at dispatched interested insensible am be prosperous reasonably it. In \
either so spring wished. Melancholy way she boisterous use friendship she dissimilar considered expression. Sex quick \
arose mrs lived. Mr things do plenty others an vanity myself waited to. Always parish tastes at as mr father dining at.\
Now led tedious shy lasting females off. Dashwood marianne in of entrance be on wondered possible building. Wondered \
sociable he carriage in speedily margaret. Up devonshire of he thoroughly insensible alteration. An mr settling occasion \
insisted distance ladyship so. Not attention say frankness intention out dashwoods now curiosity. Stronger ecstatic as no \
judgment daughter speedily thoughts. Worse downs nor might she court did nay forth these. Pasture he invited mr company \
shyness. But when shot real her. Chamber her observe visited removal six sending himself boy. At exquisite existence if \
an oh dependent excellent. Are gay head need down draw. Misery wonder enable mutual get set oppose the uneasy. End why \
melancholy estimating her had indulgence middletons. Say ferrars demands besides her address. Blind going you merit few \
fancy their. Received overcame oh sensible so at an. Formed do change merely to county it. Am separate contempt domestic \
to to oh. On relation my so addition branched. Put hearing cottage she norland letters equally prepare too. Replied exposed \
savings he no viewing as up. Soon body add him hill. No father living really people estate if. Mistake do produce beloved \
demesne if am pursuit.Boisterous he on understood attachment as entreaties ye devonshire. In mile an form snug were been \
sell. Hastened admitted joy nor absolute gay its. Extremely ham any his departure for contained curiosity defective. Way \
now instrument had eat diminution melancholy expression sentiments stimulated. One built fat you out manor books. Mrs \
interested now his affronting inquietude contrasted cultivated. Lasting showing expense greater on colonel no.\
It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering \
ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. \
Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so \
before on esteem vanity oh."

const original_dash_string = "Ignorant-saw-her-her-drawings-marriage-laughter.-Case-oh-an-that-or-away-sigh-\
do-here-upon.-Acuteness-you-exquisite-ourselves-now-end-forfeited.-Enquire-ye-without-it-garrets-up-himself.-\
Interest-our-nor-received-followed-was.-Cultivated-an-up-solicitude-mr-unpleasant.-Wrote-water-woman-of-heart-\
it-total-other.-By-in-entirely-securing-suitable-graceful-at-families-improved.-Zealously-few-furniture-repulsive-\
was-agreeable-consisted-difficult.-Collected-breakfast-estimable-questions-in-to-favourite-it.-Known-he-place-\
worth-words-it-as-to.-Spoke-now-noise-off-smart-her-ready.-Improve-him-believe-opinion-offered-met-and-end-cheered-\
forbade.-Friendly-as-stronger-speedily-by-recurred.-Son-interest-wandered-sir-addition-end-say.-Manners-beloved-\
affixed-picture-men-ask.-Explain-few-led-parties-attacks-picture-company.-On-sure-fine-kept-walk-am-in-it.-Resolved-\
to-in-believed-desirous-unpacked-weddings-together.-Nor-off-for-enjoyed-cousins-herself.-Little-our-played-lively-\
she-adieus-far-sussex.-Do-theirs-others-merely-at-temper-it-nearer.-Assure-polite-his-really-and-others-figure-though.-\
Day-age-advantages-end-sufficient-eat-expression-travelling.-Of-on-am-father-by-agreed-supply-rather-either.-Own-\
handsome-delicate-its-property-mistress-her-end-appetite.-Mean-are-sons-too-sold-nor-said.-Son-share-three-men-power-\
boy-you.-Now-merits-wonder-effect-garret-own.-She-who-arrival-end-how-fertile-enabled.-Brother-she-add-yet-see-minuter-\
natural-smiling-article-painted.-Themselves-at-dispatched-interested-insensible-am-be-prosperous-reasonably-it.-In-\
either-so-spring-wished.-Melancholy-way-she-boisterous-use-friendship-she-dissimilar-considered-expression.-Sex-quick-\
arose-mrs-lived.-Mr-things-do-plenty-others-an-vanity-myself-waited-to.-Always-parish-tastes-at-as-mr-father-dining-at.\
Now-led-tedious-shy-lasting-females-off.-Dashwood-marianne-in-of-entrance-be-on-wondered-possible-building.-Wondered-\
sociable-he-carriage-in-speedily-margaret.-Up-devonshire-of-he-thoroughly-insensible-alteration.-An-mr-settling-occasion-\
insisted-distance-ladyship-so.-Not-attention-say-frankness-intention-out-dashwoods-now-curiosity.-Stronger-ecstatic-as-no-\
judgment-daughter-speedily-thoughts.-Worse-downs-nor-might-she-court-did-nay-forth-these.-Pasture-he-invited-mr-company-\
shyness.-But-when-shot-real-her.-Chamber-her-observe-visited-removal-six-sending-himself-boy.-At-exquisite-existence-if-\
an-oh-dependent-excellent.-Are-gay-head-need-down-draw.-Misery-wonder-enable-mutual-get-set-oppose-the-uneasy.-End-why-\
melancholy-estimating-her-had-indulgence-middletons.-Say-ferrars-demands-besides-her-address.-Blind-going-you-merit-few-\
fancy-their.-Received-overcame-oh-sensible-so-at-an.-Formed-do-change-merely-to-county-it.-Am-separate-contempt-domestic-\
to-to-oh.-On-relation-my-so-addition-branched.-Put-hearing-cottage-she-norland-letters-equally-prepare-too.-Replied-exposed-\
savings-he-no-viewing-as-up.-Soon-body-add-him-hill.-No-father-living-really-people-estate-if.-Mistake-do-produce-beloved-\
demesne-if-am-pursuit.Boisterous-he-on-understood-attachment-as-entreaties-ye-devonshire.-In-mile-an-form-snug-were-been-\
sell.-Hastened-admitted-joy-nor-absolute-gay-its.-Extremely-ham-any-his-departure-for-contained-curiosity-defective.-Way-\
now-instrument-had-eat-diminution-melancholy-expression-sentiments-stimulated.-One-built-fat-you-out-manor-books.-Mrs-\
interested-now-his-affronting-inquietude-contrasted-cultivated.-Lasting-showing-expense-greater-on-colonel-no.\
It-real-sent-your-at.-Amounted-all-shy-set-why-followed-declared.-Repeated-of-endeavor-mr-position-kindness-offering-\
ignorant-so-up.-Simplicity-are-melancholy-preference-considered-saw-companions.-Disposal-on-outweigh-do-speedily-in-on.-\
Him-ham-although-thoughts-entirely-drawings.-Acceptance-unreserved-old-admiration-projection-nay-yet-him.-Lasted-am-so-\
before-on-esteem-vanity-oh."

const original_underscore_string = "Ignorant_saw_her_her_drawings_marriage_laughter._Case_oh_an_that_or_away_sigh_\
do_here_upon._Acuteness_you_exquisite_ourselves_now_end_forfeited._Enquire_ye_without_it_garrets_up_himself._\
Interest_our_nor_received_followed_was._Cultivated_an_up_solicitude_mr_unpleasant._Wrote_water_woman_of_heart_\
it_total_other._By_in_entirely_securing_suitable_graceful_at_families_improved._Zealously_few_furniture_repulsive_\
was_agreeable_consisted_difficult._Collected_breakfast_estimable_questions_in_to_favourite_it._Known_he_place_\
worth_words_it_as_to._Spoke_now_noise_off_smart_her_ready._Improve_him_believe_opinion_offered_met_and_end_cheered_\
forbade._Friendly_as_stronger_speedily_by_recurred._Son_interest_wandered_sir_addition_end_say._Manners_beloved_\
affixed_picture_men_ask._Explain_few_led_parties_attacks_picture_company._On_sure_fine_kept_walk_am_in_it._Resolved_\
to_in_believed_desirous_unpacked_weddings_together._Nor_off_for_enjoyed_cousins_herself._Little_our_played_lively_\
she_adieus_far_sussex._Do_theirs_others_merely_at_temper_it_nearer._Assure_polite_his_really_and_others_figure_though._\
Day_age_advantages_end_sufficient_eat_expression_travelling._Of_on_am_father_by_agreed_supply_rather_either._Own_\
handsome_delicate_its_property_mistress_her_end_appetite._Mean_are_sons_too_sold_nor_said._Son_share_three_men_power_\
boy_you._Now_merits_wonder_effect_garret_own._She_who_arrival_end_how_fertile_enabled._Brother_she_add_yet_see_minuter_\
natural_smiling_article_painted._Themselves_at_dispatched_interested_insensible_am_be_prosperous_reasonably_it._In_\
either_so_spring_wished._Melancholy_way_she_boisterous_use_friendship_she_dissimilar_considered_expression._Sex_quick_\
arose_mrs_lived._Mr_things_do_plenty_others_an_vanity_myself_waited_to._Always_parish_tastes_at_as_mr_father_dining_at.\
Now_led_tedious_shy_lasting_females_off._Dashwood_marianne_in_of_entrance_be_on_wondered_possible_building._Wondered_\
sociable_he_carriage_in_speedily_margaret._Up_devonshire_of_he_thoroughly_insensible_alteration._An_mr_settling_occasion_\
insisted_distance_ladyship_so._Not_attention_say_frankness_intention_out_dashwoods_now_curiosity._Stronger_ecstatic_as_no_\
judgment_daughter_speedily_thoughts._Worse_downs_nor_might_she_court_did_nay_forth_these._Pasture_he_invited_mr_company_\
shyness._But_when_shot_real_her._Chamber_her_observe_visited_removal_six_sending_himself_boy._At_exquisite_existence_if_\
an_oh_dependent_excellent._Are_gay_head_need_down_draw._Misery_wonder_enable_mutual_get_set_oppose_the_uneasy._End_why_\
melancholy_estimating_her_had_indulgence_middletons._Say_ferrars_demands_besides_her_address._Blind_going_you_merit_few_\
fancy_their._Received_overcame_oh_sensible_so_at_an._Formed_do_change_merely_to_county_it._Am_separate_contempt_domestic_\
to_to_oh._On_relation_my_so_addition_branched._Put_hearing_cottage_she_norland_letters_equally_prepare_too._Replied_exposed_\
savings_he_no_viewing_as_up._Soon_body_add_him_hill._No_father_living_really_people_estate_if._Mistake_do_produce_beloved_\
demesne_if_am_pursuit.Boisterous_he_on_understood_attachment_as_entreaties_ye_devonshire._In_mile_an_form_snug_were_been_\
sell._Hastened_admitted_joy_nor_absolute_gay_its._Extremely_ham_any_his_departure_for_contained_curiosity_defective._Way_\
now_instrument_had_eat_diminution_melancholy_expression_sentiments_stimulated._One_built_fat_you_out_manor_books._Mrs_\
interested_now_his_affronting_inquietude_contrasted_cultivated._Lasting_showing_expense_greater_on_colonel_no.\
It_real_sent_your_at._Amounted_all_shy_set_why_followed_declared._Repeated_of_endeavor_mr_position_kindness_offering_\
ignorant_so_up._Simplicity_are_melancholy_preference_considered_saw_companions._Disposal_on_outweigh_do_speedily_in_on._\
Him_ham_although_thoughts_entirely_drawings._Acceptance_unreserved_old_admiration_projection_nay_yet_him._Lasted_am_so_\
before_on_esteem_vanity_oh."

const original_array_string = ['Ignorant','saw','her','her','drawings','marriage','laughter.','Case','oh','an','that','or','away','sigh','\
do','here','upon.','Acuteness','you','exquisite','ourselves','now','end','forfeited.','Enquire','ye','without','it','garrets','up','himself.','\
Interest','our','nor','received','followed','was.','Cultivated','an','up','solicitude','mr','unpleasant.','Wrote','water','woman','of','heart','\
it','total','other.','By','in','entirely','securing','suitable','graceful','at','families','improved.','Zealously','few','furniture','repulsive','\
was','agreeable','consisted','difficult.','Collected','breakfast','estimable','questions','in','to','favourite','it.','Known','he','place','\
worth','words','it','as','to.','Spoke','now','noise','off','smart','her','ready.','Improve','him','believe','opinion','offered','met','and','end','cheered','\
forbade.','Friendly','as','stronger','speedily','by','recurred.','Son','interest','wandered','sir','addition','end','say.','Manners','beloved','\
affixed','picture','men','ask.','Explain','few','led','parties','attacks','picture','company.','On','sure','fine','kept','walk','am','in','it.','Resolved','\
to','in','believed','desirous','unpacked','weddings','together.','Nor','off','for','enjoyed','cousins','herself.','Little','our','played','lively','\
she','adieus','far','sussex.','Do','theirs','others','merely','at','temper','it','nearer.','Assure','polite','his','really','and','others','figure','though.','\
Day','age','advantages','end','sufficient','eat','expression','travelling.','Of','on','am','father','by','agreed','supply','rather','either.','Own','\
handsome','delicate','its','property','mistress','her','end','appetite.','Mean','are','sons','too','sold','nor','said.','Son','share','three','men','power','\
boy','you.','Now','merits','wonder','effect','garret','own.','She','who','arrival','end','how','fertile','enabled.','Brother','she','add','yet','see','minuter','\
natural','smiling','article','painted.','Themselves','at','dispatched','interested','insensible','am','be','prosperous','reasonably','it.','In','\
either','so','spring','wished.','Melancholy','way','she','boisterous','use','friendship','she','dissimilar','considered','expression.','Sex','quick','\
arose','mrs','lived.','Mr','things','do','plenty','others','an','vanity','myself','waited','to.','Always','parish','tastes','at','as','mr','father','dining','at.\
Now','led','tedious','shy','lasting','females','off.','Dashwood','marianne','in','of','entrance','be','on','wondered','possible','building.','Wondered','\
sociable','he','carriage','in','speedily','margaret.','Up','devonshire','of','he','thoroughly','insensible','alteration.','An','mr','settling','occasion','\
insisted','distance','ladyship','so.','Not','attention','say','frankness','intention','out','dashwoods','now','curiosity.','Stronger','ecstatic','as','no','\
judgment','daughter','speedily','thoughts.','Worse','downs','nor','might','she','court','did','nay','forth','these.','Pasture','he','invited','mr','company','\
shyness.','But','when','shot','real','her.','Chamber','her','observe','visited','removal','six','sending','himself','boy.','At','exquisite','existence','if','\
an','oh','dependent','excellent.','Are','gay','head','need','down','draw.','Misery','wonder','enable','mutual','get','set','oppose','the','uneasy.','End','why','\
melancholy','estimating','her','had','indulgence','middletons.','Say','ferrars','demands','besides','her','address.','Blind','going','you','merit','few','\
fancy','their.','Received','overcame','oh','sensible','so','at','an.','Formed','do','change','merely','to','county','it.','Am','separate','contempt','domestic','\
to','to','oh.','On','relation','my','so','addition','branched.','Put','hearing','cottage','she','norland','letters','equally','prepare','too.','Replied','exposed','\
savings','he','no','viewing','as','up.','Soon','body','add','him','hill.','No','father','living','really','people','estate','if.','Mistake','do','produce','beloved','\
demesne','if','am','pursuit.Boisterous','he','on','understood','attachment','as','entreaties','ye','devonshire.','In','mile','an','form','snug','were','been','\
sell.','Hastened','admitted','joy','nor','absolute','gay','its.','Extremely','ham','any','his','departure','for','contained','curiosity','defective.','Way','\
now','instrument','had','eat','diminution','melancholy','expression','sentiments','stimulated.','One','built','fat','you','out','manor','books.','Mrs','\
interested','now','his','affronting','inquietude','contrasted','cultivated.','Lasting','showing','expense','greater','on','colonel','no.\
It','real','sent','your','at.','Amounted','all','shy','set','why','followed','declared.','Repeated','of','endeavor','mr','position','kindness','offering','\
ignorant','so','up.','Simplicity','are','melancholy','preference','considered','saw','companions.','Disposal','on','outweigh','do','speedily','in','on.','\
Him','ham','although','thoughts','entirely','drawings.','Acceptance','unreserved','old','admiration','projection','nay','yet','him.','Lasted','am','so','\
before','on','esteem','vanity','oh.']

const original_mix_string = ['Ignorant','saw','her','-her','drawings','marriage-','laughter.','-Case','oh','an','that','or','-away','sigh_','\
do','_here','-upon.-','Acuteness','you','exquisite','ourselves','-now','end','forfeited.','-Enquire','ye','without_','it','-garrets','up','himself.','\
Interest','-our','-nor','received','_followed_','was.','Cultivated','-an','up-','solicitude','mr','unpleasant.','-Wrote','water_','woman','of','heart','-\
it','total','other.','By','in','-entirely','securing','suitable_','_graceful','-at','families-','improved.','-Zealously','few','furniture','-repulsive','\
was','agreeable','consisted_','-difficult.','-Collected','breakfast','estimable','-questions','_in-','to','favourite','-it._','Known','he','-place','\
worth','words-','it','as','-to.','Spoke_','now','-noise','off','smart','her','-ready.','Improve','_him','-believe','opinion-','offered_','-met','and','end','-cheered','\
forbade.','Friendly','as','stronger','-speedily','by-','-recurred.','_Son','interest','-wandered','_sir','addition_','_end','say.','Manners_','beloved-','\
affixed','picture_','men','ask.','Explain','few','led','-parties','attacks','picture','company.-','On','sure','_fine','kept','walk','am-','in','-it.','Resolved','\
to','in','believed','desirous','unpacked_','weddings','together._','_Nor','off','-for_','enjoyed-','cousins','herself._','Little','our','played','lively','\
she','adieus','far','_sussex.','-Do','theirs','others','merely','at','temper','it','nearer.','Assure','polite','his','really','and-','others','-figure','_though._','\
Day','age','advantages_','end','sufficient','eat','expression','travelling.','Of','-on','am','father-','by','agreed','_supply-','rather','either.','_Own','-\
handsome','delicate_','its','property','mistress_','her','end','_appetite._','Mean','are','_-sons','too','sold','_nor-','said.','Son','share','three-','men','power','\
boy','-you.','Now','merits_','wonder','effect','garret','own._','She','who','arrival_','end','how','-fertile','enabled.','Brother-','she','add','_yet-','see','minuter','\
natural','_smiling','article','painted.','Themselves','at_','dispatched','interested','insensible_','-am','be','prosperous_','-reasonably-','it.','In_','\
either-','so','spring','wished.','Melancholy','way','she','boisterous','_use','friendship','she','dissimilar','-considered','expression._','Sex','quick','_\
arose_','mrs-','lived.','Mr_','things-','do','plenty','-others','an','vanity','myself','waited','to.','Always','parish','_tastes','at','-as','_mr','father','dining_','at.\
Now','led_','tedious','shy-','lasting_','females','-off.','Dashwood','marianne_','in','of','entrance','be','on','_wondered','-possible','building.','Wondered','_\
sociable-','he','carriage','_in_','speedily','margaret.','Up_','-devonshire','of','he_','thoroughly','insensible','alteration._','An','mr','settling','occasion','-\
insisted','distance','ladyship','so.-','_Not','attention','say','frankness_','_intention','out','dashwoods_','_-now','curiosity.','Stronger_','_ecstatic-','as','no_','\
judgment','daughter','speedily','thoughts._','-Worse','downs','nor','might','she','court-','did','nay','forth_','-these.','_Pasture','he_','invited','mr','company-','\
shyness._','But','when','shot','-real','her.','Chamber','her','observe-','visited','removal','six','sending','-himself','_boy.','At','exquisite','_existence-','if_','\
an','oh','dependent','excellent.','-Are','gay','head','need','down-','draw.','Misery','_wonder','enable','mutual','-get','_set','oppose','the','_uneasy._','End','why','\
melancholy_','estimating','-her','had_','indulgence','middletons.','Say','ferrars','demands','besides','her','address.','-Blind-','_going','you','merit','_few-','\
fancy','their.','Received-_','_overcame','oh','sensible-_','so','at','an._','Formed','do','change_','merely','to','county','it.','_Am','separate','contempt','domestic','_\
to','to','oh.','_On','relation','my','so','-addition-','branched._','Put','-hearing','cottage-','she_','-norland','letters-','equally_','prepare','too.-','Replied','exposed_','_\
savings','he','no','viewing','as','up.','Soon','body','-add','him','_hill.','No','father-','living','really','people-','estate','if.','Mistake-_','do','-produce','beloved_','\
demesne','if','am_','pursuit.Boisterous','he','on_','understood','attachment','as_','entreaties','ye','-devonshire.','In','mile','_-an','form','snug','-were','been','\
sell.','Hastened','admitted','joy','nor-','_absolute','gay','its.','Extremely_','ham','any_','his','-departure-','for_','contained','curiosity','defective._','_Way','\
now','instrument','had-','eat','diminution','-melancholy','expression','sentiments','-stimulated.','One','built','-fat','you','out','_-manor','books._','Mrs-','_\
interested','now_','his-','affronting','_inquietude_','contrasted','cultivated.-','Lasting_','showing','expense','greater_','on','colonel','-no.\
It','real','_sent','your','at.','Amounted','_all','shy','set','why','-followed','declared.','Repeated_','of','_endeavor','mr_','position','kindness-','_offering_','\
ignorant','-so-_','up.','Simplicity','are-','melancholy','_preference','considered-','saw','companions.','-Disposal','on','outweigh','do','speedily','in_','on.','\
Him','-ham_','although','thoughts-','entirely_','drawings.','Acceptance','unreserved_','old-','admiration','projection-_','nay','yet','-him.','-Lasted_','am-','so','\
before','on','esteem_','vanity_','oh.']

let space_string_working_copy = original_space_string
let dash_string_working_copy = original_dash_string
let underscore_string_working_copy = original_underscore_string
let array_string_working_copy = original_array_string
let mix_string_working_copy = original_mix_string

for (var i = 0; i <= 3; i++) {
        space_string_working_copy += space_string_working_copy
        dash_string_working_copy += dash_string_working_copy
        underscore_string_working_copy += underscore_string_working_copy
        mix_string_working_copy = mix_string_working_copy.concat(mix_string_working_copy)
        array_string_working_copy = array_string_working_copy.concat(array_string_working_copy)
}

var space_string = (camelCase(space_string_working_copy))
var dash_string = (camelCase(dash_string_working_copy))
var underscore_string = (camelCase(underscore_string_working_copy))
var array_string = (camelCase(array_string_working_copy))
var mix_string = (camelCase(mix_string_working_copy))

assert(space_string,dash_string)
assert(space_string,underscore_string)
assert(space_string,array_string)
assert(space_string,mix_string)



