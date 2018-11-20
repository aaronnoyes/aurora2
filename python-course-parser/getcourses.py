#!/usr/bin/python3

from bs4 import BeautifulSoup
import re
import json
import random

# CONSTANts
course_html_path = './Winter2019.html'
new_json_file_path = './Winter2019CourseList.js'
term='WINTER2019'

one_to_five = range(1, 6)
one_to_one_hundred = range(1, 101)

days_and_times = [{
    'days': 'MWF',
    'times': [
        {'start': '08:30', 'end': '09:20'}, {'start': '09:30', 'end': '10:20'},
        {'start': '10:30', 'end': '11:20'}, {'start': '11:30', 'end': '12:20'},
        {'start': '12:20', 'end': '13:20'}, {'start': '13:30', 'end': '14:20'},
        {'start': '14:30', 'end': '15:20'}, {'start': '15:30', 'end': '16:20'},
        {'start': '16:30', 'end': '17:20'}]
    }, {
    'days': 'TR',
    'times': [
        {'start': '08:30', 'end': '09:45'}, {'start': '10:00', 'end': '11:15'},
        {'start': '11:30', 'end': '12:45'}, {'start': '13:00', 'end': '14:15'},
        {'start': '14:30', 'end': '15:45'}, {'start': '16:00', 'end': '17:15'}]
    }]

rooms = ['EITC E1', 'EITC E2', 'EITC E3', 'Buller', 'Tier', 'Armes', 'Biological Sciences',
    'Fletcher Argue', 'Architecture', 'Education', 'Human Ecology',
    'Machray', 'Isbister', 'Tache', 'Drake', 'Agriculture', 'Helen Glass']

room_numbers = range(100, 401)


# FUNCTIONS
def get_sections(num_sections, lab=False):
    sections = []

    for i in range(1, num_sections + 1):
        day_and_time = random.choice(days_and_times)
        new_section = {}
        if lab == True:
            new_section['section'] = 'B%02d' % (i,)
        else:
            new_section['section'] = 'A%02d' % (i,)
        new_section['days'] = day_and_time['days']
        new_section['instructor'] = 'Professor %d' % (i,)
        new_section['location'] = "%s %d" % (random.choice(rooms), random.choice(room_numbers))
        new_section['time'] = random.choice(day_and_time['times'])
        sections.append(new_section)

    return sections

def get_course_sections(course_level):
    """
    Create a randomized set of sections for a course, with reduced number of sections for higher
    level courses.
        course_level: Integer greater than or equal to 1, 1 represents 1000 level course
    """
    num_sections = 1

    if course_level == 1:
        num_sections = random.choice(one_to_five)
    elif course_level == 2:
        num_sections = random.choice(one_to_five[:4])
    elif course_level == 3:
        num_sections = random.choice(one_to_five[:2])

    return get_sections(num_sections, lab=False)


def get_lab_sections(num_labs):
    """
    Returns a randomized number of lab sections with a 85% chance of no lab sections for a course.
    """
    n = random.choice(one_to_one_hundred)

    if n <= 15:
        return get_sections(num_labs, lab=True)
    else:
        return []



# START OF PROCESSING
with open(course_html_path, 'r') as f:

    soup = BeautifulSoup(f, 'html.parser')

    course_list = {'term': term, 'courses': []}

    curr_department = ''
    curr_course_id = ''
    curr_course_name = ''
    curr_course_credits = ''
    count = 0

    for dd_item in soup.find_all(class_=re.compile('(ddheader|dddefault)')):
        # Header has department name
        if dd_item.name == 'th':
            curr_department = dd_item.text
            count = 0

        # Each sequential set of 4 tags have course information
        else:
            if count == 0:
                curr_course_id = dd_item.text
                count += 1

            elif count == 1:
                curr_course_id = '{0} {1}'.format(curr_course_id, dd_item.text)
                count += 1

            elif count == 2:
                curr_course_name = dd_item.text
                count += 1

            elif count == 3:
                curr_course_credits = dd_item.text

                new_course = {
                    'name': curr_course_name,
                    'courseID': curr_course_id,
                    'department': curr_department,
                    'credits': curr_course_credits
                }

                # Get course and lab sections
                curr_course_level = int(curr_course_id.split(' ')[1][0])
                course_sections = get_course_sections(curr_course_level)
                lab_sections = get_lab_sections(len(course_sections))
                new_course['sections'] = course_sections
                if len(lab_sections) != 0:
                    new_course['labSections'] = lab_sections

                course_list['courses'].append(new_course)
                count = 0

# Write object to file as JSON
with open(new_json_file_path, 'w') as f:
    f.write(json.dumps(course_list, indent=1, ensure_ascii=False))
